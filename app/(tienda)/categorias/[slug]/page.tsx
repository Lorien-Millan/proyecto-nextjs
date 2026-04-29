import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CategoriaDetallePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const supabase = createServerClient()

  // Convierte el slug a un formato que busque en la BD
  // "accion" → busca "Acción", "accion", "ACCION", etc.
  const categoriaName = slug.replace(/-/g, ' ')
  
  // Busca la categoría (insensible a mayúsculas)
  const { data: categoria, error: catError } = await supabase
    .from('categoria')
    .select('id_categoria, nombre, descripcion')
    .ilike('nombre', categoriaName) // ilike es case-insensitive
    .single()

  if (catError || !categoria) {
    console.error('Categoría no encontrada:', { slug, categoriaName, error: catError })
    notFound()
  }

  // Obtiene los juegos de esta categoría
  const { data: juegos, error: juegosError } = await supabase
    .from('producto')
    .select(`
      id_producto,
      titulo,
      descripcion,
      precio,
      stock,
      url_imagen,
      plataforma
    `)
    .eq('id_categoria', categoria.id_categoria)
    .order('titulo')

  if (juegosError) {
    console.error('Error cargando juegos:', juegosError)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {categoria.nombre}
        </h1>
        {categoria.descripcion && (
          <p className="text-gray-600 mt-2">{categoria.descripcion}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {juegos?.length || 0} juegos disponibles
        </p>
      </div>

      {/* Juegos */}
      {!juegos || juegos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No hay juegos en esta categoría aún.
          </p>
          <Link 
            href="/categorias" 
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            ← Volver a categorías
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {juegos.map((juego) => (
            <Link 
              key={juego.id_producto} 
              href={`/juegos/${juego.id_producto}`}
              className="bg-white border rounded-lg p-4 hover:shadow-lg hover:border-blue-500 transition"
            >
              {juego.url_imagen && (
                <img 
                  src={juego.url_imagen} 
                  alt={juego.titulo}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="font-semibold text-gray-900">{juego.titulo}</h3>
              {juego.plataforma && (
                <p className="text-sm text-gray-500">🎮 {juego.plataforma}</p>
              )}
              <p className="text-lg font-bold text-green-600 mt-2">
                {juego.precio} €
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Volver */}
      <Link href="/categorias" className="text-gray-600 hover:text-gray-900">
        ← Volver a categorías
      </Link>
    </div>
  )
}