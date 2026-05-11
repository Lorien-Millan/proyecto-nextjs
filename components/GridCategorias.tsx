import Link from 'next/link';

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categorias.map((categoria) => (
        <Link
          href={`/shop?categoria=${categoria.id_categoria}`}
          key={categoria.id_categoria}
          className="group"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-transparent transition-all duration-300 hover:border-purple-500 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center gap-4">
              {/* Icono de categoría */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🎮
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                  {categoria.nombre}
                </h3>
                
                {categoria.descripcion && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {categoria.descripcion}
                  </p>
                )}
              </div>

              {/* Flecha indicadora */}
              <div className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300">
                →
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}