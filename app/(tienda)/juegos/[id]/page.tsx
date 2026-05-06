'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Star, 
  Calendar, 
  Gamepad2, 
  Building2,
  Shield,
  ChevronLeft,
  Check
} from 'lucide-react';

// Types
interface Producto {
  id_producto: number;
  titulo: string;
  descripcion: string;
  precio: number;
  stock: number;
  plataforma: string;
  desarrollador: string;
  calificacion_pegi: string;
  url_imagen?: string;
  fecha_lanzamiento: string;
  id_categoria: number;
}

interface Categoria {
  id_categoria: number;
  nombre: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductoPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [producto, setProducto] = useState<Producto | null>(null);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducto();
  }, [productId]);

  const loadProducto = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch product
      const {  id_producto: productoData, error: productoError } = await supabase
        .from('producto')
        .select('*')
        .eq('id_producto', productId)
        .single();

      if (productoError) throw productoError;
      if (!productoData) {
        setError('Producto no encontrado');
        return;
      }

      setProducto(productoData);

      // Fetch category
      const {  categoria: categoriaData } = await supabase
        .from('categoria')
        .select('nombre')
        .eq('id_categoria', productoData.id_categoria)
        .single();

      if (categoriaData) {
        setCategoria(categoriaData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!producto) return;

    try {
      setAddingToCart(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Check stock
      if (quantity > producto.stock) {
        setError(`Solo hay ${producto.stock} unidades disponibles`);
        return;
      }

      // Get or create pending order
      const {  pedido } = await supabase
        .from('pedido')
        .select('id_pedido')
        .eq('id_usuario', user.id)
        .eq('estado', 'pendiente')
        .single();

      let pedidoId = pedido?.id_pedido;

      if (!pedidoId) {
        const {  nuevoPedido, error: pedidoError } = await supabase
          .from('pedido')
          .insert({
            id_usuario: user.id,
            fecha_pedido: new Date().toISOString(),
            estado: 'pendiente',
            total_pagar: 0
          })
          .select()
          .single();

        if (pedidoError) throw pedidoError;
        pedidoId = nuevoPedido.id_pedido;
      }

      // Check if product already in cart
      const {  existingItem } = await supabase
        .from('detalles_pedido')
        .select('*')
        .eq('id_pedido', pedidoId)
        .eq('id_producto', producto.id_producto)
        .single();

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.cantidad + quantity;
        const { error: updateError } = await supabase
          .from('detalles_pedido')
          .update({ cantidad: newQuantity })
          .eq('id_detalle_pedido', existingItem.id_detalle_pedido);

        if (updateError) throw updateError;
      } else {
        // Add new item
        const { error: insertError } = await supabase
          .from('detalles_pedido')
          .insert({
            id_pedido: pedidoId,
            id_producto: producto.id_producto,
            cantidad: quantity,
            precio_compra: producto.precio
          });

        if (insertError) throw insertError;
      }

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error && !producto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/tienda/productos')}
            className="text-blue-600 hover:underline"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  if (!producto) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {producto.url_imagen ? (
                <Image
                  src={producto.url_imagen}
                  alt={producto.titulo}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gamepad2 className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {categoria && (
                  <span className="text-sm text-blue-600 font-medium">
                    {categoria.nombre}
                  </span>
                )}
                {producto.stock > 0 ? (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Disponible
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">
                    Sin stock
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {producto.titulo}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{producto.desarrollador}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(producto.fecha_lanzamiento).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {producto.descripcion}
            </p>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Gamepad2 className="w-4 h-4" />
                  <span className="text-sm">Plataforma</span>
                </div>
                <p className="font-semibold text-gray-900">{producto.plataforma}</p>
              </div>
              
              <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Clasificación</span>
                </div>
                <p className="font-semibold text-gray-900">
                  PEGI {producto.calificacion_pegi}
                </p>
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {producto.precio.toFixed(2)}€
                </span>
                <span className="text-gray-500">
                  ({(producto.precio / quantity).toFixed(2)}€ por unidad)
                </span>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(producto.stock, quantity + 1))}
                    disabled={quantity >= producto.stock}
                    className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    (Stock disponible: {producto.stock})
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={addToCart}
                disabled={addingToCart || producto.stock === 0 || addedToCart}
                className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Añadido al carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {addingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                  </>
                )}
              </button>

              {/* Total */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {(producto.precio * quantity).toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}