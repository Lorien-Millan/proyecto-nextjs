import Image from 'next/image';
import Link from 'next/link';

interface Producto {
  id_producto: number;
  titulo: string;
  precio: number;
  url_imagen: string;
  stock: number;
  ventas: number;
  categoria?: {
    nombre: string;
  } | null;
}

interface TopVentasProps {
  productos: Producto[];
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
      <h2 className="text-2xl font-bold text-center mb-8">🏆 Top 3 Más Vendidos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productos.map((producto, index) => (
          <Link 
            href={`/product/${producto.id_producto}`}
            key={producto.id_producto}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50">
              {/* Badge de posición */}
              <div className={`
                absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white z-10
                ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'}
              `}>
                #{index + 1}
              </div>

              {/* Imagen del producto */}
              <div className="relative h-64 bg-gray-800">
                {producto.url_imagen ? (
                  <Image
                    src={producto.url_imagen}
                    alt={producto.titulo}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="p-6">
                <div className="text-sm text-purple-600 font-semibold mb-2">
                  {producto.categoria?.nombre || 'Sin categoría'}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {producto.titulo}
                </h3>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold text-purple-700">
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
        ))}
      </div>
    </div>
  );
}