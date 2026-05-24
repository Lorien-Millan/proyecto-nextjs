'use client';  // 👈 Necesario para usar el contexto del carrito

import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCarrito } from '@/contexts/CarritoContext';  // 👈 Importamos el hook del carrito
import { useEffect, useState } from 'react';

// --- 🎨 Estilos de Badges ---
function getPlatformStyle(plataforma: string | null) {
  if (!plataforma) return 'bg-gray-200 text-gray-600';
  const p = plataforma.toLowerCase();
  if (p.includes('switch') || p.includes('nintendo')) return 'bg-red-600 text-white shadow-red-500/30';
  if (p.includes('playstation') || p.includes('ps4') || p.includes('ps5') || p.includes('ps')) return 'bg-blue-600 text-white shadow-blue-500/30';
  if (p.includes('xbox')) return 'bg-green-600 text-white shadow-green-500/30';
  if (p.includes('pc') || p.includes('steam')) return 'bg-gray-900 text-white shadow-gray-500/30';
  return 'bg-gray-200 text-gray-600';
}

function getPegiStyle(pegi: number | null) {
  if (!pegi) return 'bg-gray-200 text-gray-600';
  if (pegi <= 7) return 'bg-green-500 text-white';
  if (pegi === 12) return 'bg-yellow-500 text-black';
  if (pegi === 16) return 'bg-orange-500 text-white';
  if (pegi === 18) return 'bg-red-600 text-white';
  return 'bg-gray-200 text-gray-600';
}

// --- 🏷️ Formateo de Categoría (Tildes) ---
const CATEGORY_NAME_MAP: Record<string, string> = {
  'accion': 'Acción', 'clasificacion': 'Clasificación', 'estrategia': 'Estrategia',
  'corazon': 'Corazón', 'mision': 'Misión', 'aventura': 'Aventura', 'simulacion': 'Simulación'
};

function formatCategoryName(nombre: string): string {
  const lower = nombre.toLowerCase();
  if (CATEGORY_NAME_MAP[lower]) return CATEGORY_NAME_MAP[lower];
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
}

// --- 📄 Página de Producto ---
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { agregarAlCarrito } = useCarrito();  // 👈 Hook del carrito
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducto() {
      const { id } = await params;
      const supabase = createServerClient();

      const { data: productoData } = await supabase
        .from('producto')
        .select('*, categoria:categoria(nombre)')
        .eq('id_producto', parseInt(id))
        .limit(1);

      if (productoData && productoData.length > 0) {
        setProducto(productoData[0]);
      } else {
        notFound();
      }
      setLoading(false);
    }

    loadProducto();
  }, [params]);

  if (loading || !producto) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-2xl font-bold text-rosa">Cargando...</div>
      </main>
    );
  }

  // Preparar datos visuales
  const platformClasses = getPlatformStyle(producto.plataforma);
  const pegiClasses = getPegiStyle(producto.calificacion_pegi);
  const categoriaDisplay = producto.categoria?.nombre ? formatCategoryName(producto.categoria.nombre) : 'Sin categoría';
  const imageUrl = producto.imagen2 || producto.imagen || '';

  // 🔢 Calcular descuento
  let descuentoPorcentaje = 0;
  let ahorro = 0;
  if (producto.precio_original && producto.precio_original > producto.precio) {
    descuentoPorcentaje = Math.round(
      ((producto.precio_original - producto.precio) / producto.precio_original) * 100
    );
    ahorro = producto.precio_original - producto.precio;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 🔙 Botón Volver */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-rosa transition-colors font-medium mb-8">
          <span className="mr-2">←</span> Volver a la tienda
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* 🖼️ COLUMNA IZQUIERDA: IMAGEN VERTICAL */}
            <div className="relative h-[500px] lg:h-[700px] bg-gray-900">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={producto.titulo}
                  fill
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-6xl">
                  🎮
                </div>
              )}

              {/* Badge PEGI flotante */}
              {producto.calificacion_pegi && (
                <div className="absolute top-6 right-6 shadow-xl">
                  <div className={`
                    w-14 h-14 rounded-lg flex items-center justify-center 
                    font-extrabold text-lg border-2 border-white/20 backdrop-blur-sm
                    ${pegiClasses}
                  `}>
                    {producto.calificacion_pegi}
                  </div>
                </div>
              )}

              {/* Badge de Descuento */}
              {descuentoPorcentaje > 0 && (
                <div className="absolute top-6 left-6 shadow-xl">
                  <div className="bg-red-600 text-white text-lg font-bold px-4 py-2 rounded-lg">
                    -{descuentoPorcentaje}%
                  </div>
                </div>
              )}
            </div>

            {/* 📝 COLUMNA DERECHA: INFORMACIÓN */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              
              {/* Categoría y Plataforma */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-rosa/20 text-rosa px-3 py-1 rounded-full text-sm font-semibold">
                  {categoriaDisplay}
                </span>
                {producto.plataforma && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${platformClasses}`}>
                    {producto.plataforma}
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                {producto.titulo}
              </h1>

              {/* 💰 PRECIOS CON DESCUENTO */}
              <div className="flex items-end gap-4 mb-6 border-b border-gray-100 pb-6">
                {producto.precio_original && producto.precio_original > producto.precio ? (
                  <>
                    <span className="text-2xl text-gray-400 line-through font-medium pb-2">
                      {producto.precio_original?.toFixed(2)}€
                    </span>
                    <span className="text-5xl font-bold text-red-600">
                      {producto.precio?.toFixed(2)}€
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                      AHORRAS {ahorro.toFixed(2)}€
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-bold text-gray-900">
                      {producto.precio?.toFixed(2)}€
                    </span>
                  </>
                )}
                
                <span className={`pb-2 text-sm font-semibold ${producto.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {producto.stock > 0 ? '● En Stock' : '● Agotado'}
                </span>
              </div>

              {/* Descripción */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {producto.descripcion || 'Sin descripción disponible.'}
                </p>
              </div>

              {/* Detalles Técnicos */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-xl border-2" style={{ backgroundColor: 'var(--color-verde-bg)', borderColor: 'var(--color-rosa-principal)' }}>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Desarrollador</span>
                  <p className="text-gray-800 font-medium">{producto.desarrollador || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Lanzamiento</span>
                  <p className="text-gray-800 font-medium">
                    {producto.fecha_lanzamiento ? new Date(producto.fecha_lanzamiento).getFullYear() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">ID Producto</span>
                  <p className="text-gray-800 font-medium">#{producto.id_producto}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">PEGI</span>
                  <p className="text-gray-800 font-medium">{producto.calificacion_pegi ? `+${producto.calificacion_pegi}` : 'N/A'}</p>
                </div>
              </div>

              {/* 🛒 Botón de Compra - FUNCIONAL */}
              <div className="mt-auto">
                {producto.stock > 0 ? (
                  <button
                    onClick={() =>
                      agregarAlCarrito({
                        id_producto: producto.id_producto,
                        titulo: producto.titulo,
                        precio: producto.precio,
                        imagen: imageUrl,
                        stock: producto.stock,
                        cantidad: 1,
                      })
                    }
                    className="cursor-pointer w-full bg-rosa text-white py-4 rounded-xl font-bold font-heading text-3xl shadow-lg shadow-rosa/40 hover:scale-[1.01] transition-all active:scale-95"
                    style={{ backgroundColor: 'var(--color-rosa-principal)' }}
                  >
                    🛒 Añadir al Carrito
                  </button>
                ) : (
                  <button
                    disabled
                    className="cursor-pointer w-full bg-gray-200 text-gray-400 py-4 rounded-xl font-bold text-lg cursor-not-allowed"
                  >
                    Producto Agotado
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}