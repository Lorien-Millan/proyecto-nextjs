import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PaginaCategorias() {
  const supabase = createServerClient()
  
  const {  categorias, error } = await supabase
    .from('categoria')
    .select('id_categoria, nombre, descripcion')
    .order('nombre')

  if (error) {
    return <p className="text-red-500">Error cargando géneros: {error.message}</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🎮 Géneros</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias?.map((cat) => (
          <Link 
            key={cat.id_categoria} 
            href={`/categorias/${cat.nombre.toLowerCase().replace(/\s+/g, '-')}`}
            className="block p-6 border rounded-lg hover:shadow-lg hover:border-blue-500 transition bg-white"
          >
            <h2 className="text-xl font-semibold text-gray-800">{cat.nombre}</h2>
            <p className="text-gray-600 mt-2 line-clamp-2">{cat.descripcion}</p>
            <span className="text-blue-600 text-sm mt-3 inline-block">Ver juegos →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}