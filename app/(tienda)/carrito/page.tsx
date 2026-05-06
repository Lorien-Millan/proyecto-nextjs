'use client';

// CORRECCIÓN 1: Cambiar a la librería estándar de Supabase
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Store, ArrowLeft } from 'lucide-react';

// Configuración del cliente (Asegúrate de tener estas variables en tu .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ... (El resto de tus interfaces Producto y CarritoItem se quedan igual) ...
interface Producto {
  id_producto: number;
  titulo: string;
  descripcion: string;
  precio: number;
  stock: number;
  plataforma: string;
  desarrollador: string;
  calificacion_pegi: string;
  imagen_url?: string;
}

interface CarritoItem {
  id_detalle_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_compra: number;
  producto: Producto;
}

export default function CarritoPage() {
  const router = useRouter();
  // Ya no necesitas createClientComponentClient, usamos el 'supabase' de arriba
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // CORRECCIÓN 2: Aquí es donde se usa useEffect (por eso desaparece el error)
  useEffect(() => {
    loadCarrito();
  }, []);

  const loadCarrito = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Si no hay usuario, redirigir al login (opcional)
        // router.push('/login'); 
        setLoading(false);
        return;
      }

      // 2. Buscar el pedido con estado 'pendiente'
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedido')
        .select('*')
        .eq('id_usuario', user.id)
        .eq('estado', 'pendiente')
        .single();

      if (pedidoError || !pedido) {
        setCarrito([]);
        setLoading(false);
        return;
      }

      // 3. Obtener los detalles del pedido
      const { data: detalles, error: detallesError } = await supabase
        .from('detalles_pedido')
        .select(`
          *,
          producto:producto (
            id_producto, titulo, descripcion, precio, stock, plataforma, desarrollador, calificacion_pegi
          )
        `)
        .eq('id_pedido', pedido.id_pedido);

      if (detallesError) throw detallesError;

      setCarrito(detalles || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (Aquí irían las funciones updateCantidad, eliminarItem, etc.) ...
  
  // Renderizado básico para que veas que funciona
  if (loading) return <div className="p-10 text-center">Cargando carrito...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Tu Carrito</h1>
        
        {carrito.length === 0 ? (
          <p className="text-gray-500">El carrito está vacío.</p>
        ) : (
          <div className="space-y-4">
            {carrito.map((item) => (
              <div key={item.id_detalle_pedido} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-bold">{item.producto.titulo}</h3>
                  <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                </div>
                <div className="font-bold">
                  {(item.cantidad * item.precio_compra).toFixed(2)}€
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}