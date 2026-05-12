import Image from 'next/image';
import Link from 'next/link';

interface Producto {
  id_producto: number;
  titulo: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  url_imagen: string | null;
  plataforma: string | null;
  desarrollador: string | null;
  calificacion_pegi: number | null;
  fecha_lanzamiento: string | null;
  categoria?: {
    nombre: string;
  } | null;
}

interface ProductCardProps {
  producto: Producto;
}

//  Función auxiliar para determinar el estilo según la plataforma
function getPlatformStyle(plataforma: string | null) {
  if (!plataforma) return 'bg-gray-200 text-gray-700'; // Default
  
  const p = plataforma.toLowerCase();

  // Nintendo Switch
  if (p.includes('switch') || p.includes('nintendo')) {
    return 'bg-red-600 text-white shadow-red-500/40';
  }
  
  // PlayStation
  if (p.includes('playstation') || p.includes('ps4') || p.includes('ps5') || p.includes('ps')) {
    return 'bg-blue-600 text-white shadow-blue-500/40';
  }
  
  // Xbox
  if (p.includes('xbox')) {
    return 'bg-green-600 text-white shadow-green-500/40';
  }
  
  // PC
  if (p.includes('pc') || p.includes('steam')) {
    return 'bg-gray-900 text-white shadow-gray-600/40';
  }

  // Fallback genérico
  return 'bg-gray-200 text-gray-700';
}

export default function ProductCard({ producto }: ProductCardProps) {
  // Obtener las clases de estilo
  const platformClasses = getPlatformStyle(producto.plataforma);

  return (
    <Link 
      href={`/product/${producto.id_producto}`}
      className="group block"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100 h-full flex flex-col">
        
        {/*  Imagen del producto */}
        <div className="relative h-64 bg-gray-800 overflow-hidden">
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={producto.titulo}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-700 to-gray-900">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-2">🎮</div>
                <p>Sin imagen</p>
              </div>
            </div>
          )}
          
          {/* Badge de PEGI (Esquina superior derecha) */}
          {producto.calificacion_pegi && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded px-2 py-1 shadow-lg border border-gray-200">
              <span className="text-xs font-bold text-black">
                PEGI {producto.calificacion_pegi}
              </span>
            </div>
          )}

          {/* Badge de Stock (Esquina superior izquierda) */}
          {producto.stock === 0 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white rounded px-2 py-1 shadow-lg text-xs font-bold">
              SIN STOCK
            </div>
          )}
        </div>

        {/* 🟩 Información del producto */}
        <div className="p-5 flex flex-col flex-grow">
          
          {/* 🔹 Badge de Plataforma (Color dinámico) */}
          {producto.plataforma && (
            <div className="mb-3">
              <span className={`
                inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm
                ${platformClasses}
              `}>
                {producto.plataforma}
              </span>
            </div>
          )}

          {/* Título */}
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors">
            {producto.titulo}
          </h3>

          {/* Espacio flexible para empujar el precio abajo */}
          <div className="flex-grow"></div>

          {/* Pie de tarjeta: Precio y botón */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium">Precio</span>
              <span className="text-2xl font-extrabold text-gray-900">
                {producto.precio?.toFixed(2)}€
              </span>
            </div>
            
            <button className={`
              px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md
              ${producto.stock > 0 
                ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}
            `}>
              {producto.stock > 0 ? 'Comprar' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}