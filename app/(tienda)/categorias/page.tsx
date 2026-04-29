import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CategoriasPage() {
  const supabase = createServerClient()
  
  // Consulta a Supabase
  const { data: categorias, error } = await supabase
    .from('categoria')
    .select('id_categoria, nombre, descripcion')
    .order('nombre')

  // Manejo de errores
  if (error) {
    console.error('Error cargando categorías:', error)
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">🎮 Categorías</h1>
        <p className="text-red-500">Error cargando categorías: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">🎮 Categorías</h1>
      
      {categorias && categorias.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <Link 
              key={cat.id_categoria} 
              href={`/categorias/${cat.nombre}`}
              className="block p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all bg-white"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {cat.nombre}
              </h2>
              {cat.descripcion && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {cat.descripcion}
                </p>
              )}
              <span className="text-blue-600 text-sm mt-3 inline-block font-medium">
                Ver juegos →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-2">No hay categorías disponibles</p>
          <p className="text-sm text-gray-400">
            Añade categorías desde Supabase para comenzar
          </p>
        </div>
      )}
    </div>
  )
}