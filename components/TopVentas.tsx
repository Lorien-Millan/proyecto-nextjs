import Image from 'next/image';
import Link from 'next/link';

interface Producto {
  id_producto: number;
  titulo: string;
  precio: number;
  imagen: string;
  stock: number;
  ventas: number;
  plataforma?: string | null;
  calificacion_pegi?: number | null;
  categoria?: {
    nombre: string;
  } | null;
}

interface TopVentasProps {
  productos: Producto[];
}

// 🎮 Función para colores de plataforma
function getPlatformStyle(plataforma: string | null | undefined) {
  if (!plataforma) return 'bg-gray-200 text-gray-700';
  const p = plataforma.toLowerCase();
  if (p.includes('switch') || p.includes('nintendo')) {
    return 'bg-red-600 text-white shadow-red-500/40';
  }
  if (p.includes('playstation') || p.includes('ps4') || p.includes('ps5') || p.includes('ps')) {
    return 'bg-blue-600 text-white shadow-blue-500/40';
  }
  if (p.includes('xbox')) {
    return 'bg-green-600 text-white shadow-green-500/40';
  }
  if (p.includes('pc') || p.includes('steam')) {
    return 'bg-gray-900 text-white shadow-gray-600/40';
  }
  return 'bg-gray-200 text-gray-700';
}

// 🎯 Función para colores PEGI (oficiales)
function getPegiStyle(pegi: number | null | undefined) {
  if (!pegi) return 'bg-gray-300 text-gray-700';
  switch (pegi) {
    case 3:
      return 'bg-green-500 text-white border-green-600';
    case 7:
      return 'bg-green-600 text-white border-green-700';
    case 12:
      return 'bg-yellow-500 text-black border-yellow-600';
    case 16:
      return 'bg-orange-500 text-white border-orange-600';
    case 18:
      return 'bg-red-600 text-white border-red-700';
    default:
      return 'bg-gray-300 text-gray-700';
  }
}

// 🏷️ Mapeo de Tildes
const CATEGORY_NAME_MAP: Record<string, string> = {
  'accion': 'Acción',
  'clasificacion': 'Clasificación',
  'estrategia': 'Estrategia',
  'corazon': 'Corazón',
  'mision': 'Misión',
  'aventura': 'Aventura',
  'simulacion': 'Simulación',
  'deportes': 'Deportes',
  'carreras': 'Carreras',
};

function formatCategoryName(nombre: string): string {
  const lower = nombre.toLowerCase();
  if (CATEGORY_NAME_MAP[lower]) return CATEGORY_NAME_MAP[lower];
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
}

export default function TopVentas({ productos }: TopVentasProps) {
  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300">No hay productos disponibles aún</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-8 pb-10">
        <span className="bg-gradient-to-r from-yellow-500 to-white text-black px-5 py-3 rounded-full text-3xl font-semibold">
        🏆 Top 3 Más Vendidos
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productos.map((producto, index) => {
          const platformClasses = getPlatformStyle(producto.plataforma);
          const pegiClasses = getPegiStyle(producto.calificacion_pegi);

          return (
            <Link 
              href={`/product/${producto.id_producto}`}
              key={producto.id_producto}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-rosa/50 relative">
                {/* Badge de posición */}
                <div className={`
                  absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white z-20 shadow-lg
                  ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'}
                `}>
                  #{index + 1}
                </div>

                {/* Imagen del producto */}
                <div className="relative h-64 bg-gray-800">
                  {producto.imagen ? (
                    <Image
                      src={producto.imagen}
                      alt={producto.titulo}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Sin imagen
                    </div>
                  )}
                  
                  {/* 🔹 Badge de PEGI - Esquina superior derecha */}
                  {producto.calificacion_pegi && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center 
                        font-extrabold text-sm border-2 shadow-lg
                        ${pegiClasses}
                      `}>
                        {producto.calificacion_pegi}
                      </div>
                    </div>
                  )}

                  {/* 🔹 Badge de Plataforma - Debajo del PEGI */}
                  {producto.plataforma && (
                    <div className={`
                      absolute top-4 right-4 z-10
                      ${producto.calificacion_pegi ? 'top-20' : ''}
                    `}>
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md
                        ${platformClasses}
                      `}>
                        {producto.plataforma}
                      </span>
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div className="p-6">
                  {/* 🏷️ Categoría formateada y en mayúsculas */}
                  <div className="text-sm text-rosa font-semibold mb-2 uppercase tracking-wide">
                    {producto.categoria?.nombre 
                      ? formatCategoryName(producto.categoria.nombre).toUpperCase() 
                      : 'SIN CATEGORÍA'}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {producto.titulo}
                  </h3>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ${producto.precio?.toFixed(2)}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>🛒</span>
                      <span className="font-semibold">{producto.ventas} ventas</span>
                    </div>
                  </div>

                  {producto.stock === 0 && (
                    <div className="mt-3 text-red-600 font-semibold text-sm">
                      ⚠️ Sin stock
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}