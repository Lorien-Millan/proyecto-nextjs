import Image from 'next/image';
import Link from 'next/link';

// 1. Actualizamos la interfaz para incluir la imagen
interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
  imagen?: string; // Campo opcional por si alguna categoría no tiene imagen
}

interface GridCategoriasProps {
  categorias: Categoria[];
}

export default function GridCategorias({ categorias }: GridCategoriasProps) {
  if (!categorias || categorias.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay categorías disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categorias.map((categoria) => (
        <Link
          href={`/shop?categoria=${categoria.id_categoria}`}
          key={categoria.id_categoria}
          className="group relative block h-64 overflow-hidden rounded-xl shadow-lg cursor-pointer"
        >
          {/* Contenedor de la Imagen */}
          <div className="relative h-full w-full">
            {categoria.imagen ? (
              <Image
                src={categoria.imagen}
                alt={`Categoría ${categoria.nombre}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              // Fallback si no hay imagen (fondo gris)
              <div className="h-full w-full bg-gray-200" />
            )}
            
            {/* Capa oscura para mejorar legibilidad del texto (Overlay) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Texto sobre la imagen */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
              {categoria.nombre}
            </h3>
            
            {categoria.descripcion && (
              <p className="text-gray-300 text-sm mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {categoria.descripcion}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}