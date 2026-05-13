import Image from 'next/image';
import Link from 'next/link';

interface Producto {
  id_producto: number;
  titulo: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen: string | null;
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

// 🎮 Función para colores de plataforma
function getPlatformStyle(plataforma: string | null) {
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
function getPegiStyle(pegi: number | null) {
  if (!pegi) return 'bg-gray-300 text-gray-700';

  switch (pegi) {
    case 3:
      return 'bg-green-500 text-white border-green-600'; // Verde - Todos los públicos
    case 7:
      return 'bg-green-600 text-white border-green-700'; // Verde oscuro - +7
    case 12:
      return 'bg-yellow-500 text-black border-yellow-600'; // Amarillo - +12
    case 16:
      return 'bg-orange-500 text-white border-orange-600'; // Naranja - +16
    case 18:
      return 'bg-red-600 text-white border-red-700'; // Rojo - +18
    default:
      return 'bg-gray-300 text-gray-700'; // Default
  }
}

export default function ProductCard({ producto }: ProductCardProps) {
  const platformClasses = getPlatformStyle(producto.plataforma);
  const pegiClasses = getPegiStyle(producto.calificacion_pegi);

  return (
    <Link 
      href={`/product/${producto.id_producto}`}
      className="group block"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100 h-full flex flex-col">
        
        {/* 🖼️ Imagen del producto */}
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
          
          {/* 🔹 Badge de PEGI (Colores oficiales) - Esquina superior derecha */}
          {producto.calificacion_pegi && (
            <div className="absolute top-3 right-3">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center 
                font-extrabold text-sm border-2 shadow-lg
                ${pegiClasses}
              `}>
                {producto.calificacion_pegi}
              </div>
            </div>
          )}

          {/* 🔴 Badge de Stock - Esquina superior izquierda */}
          {producto.stock === 0 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white rounded px-3 py-1 shadow-lg text-xs font-bold">
              SIN STOCK
            </div>
          )}
        </div>

        {/* 📋 Información del producto */}
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

          {/* Descripción corta */}
          {producto.descripcion && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {producto.descripcion}
            </p>
          )}

          {/* Espacio flexible */}
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
                ? 'bg-rosa text-white hover:bg-rosa-hover hover:shadow-lg hover:shadow-rosa/30' 
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