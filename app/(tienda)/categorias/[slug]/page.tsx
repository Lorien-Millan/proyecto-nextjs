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
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      
      {/* 🏷️ Header de la Categoría */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-pink-500 mb-4 capitalize">
          {categoria.nombre}
        </h1>
        
        {categoria.descripcion && (
          <p className="text-gray-400 max-w-2xl mx-auto font-body text-lg">
            {categoria.descripcion}
          </p>
        )}
        
        <div className="mt-6 inline-block bg-gray-900 px-4 py-2 rounded-full border border-gray-800">
          <span className="text-sm text-gray-300 font-body">
            {juegos?.length || 0} juegos disponibles
          </span>
        </div>
      </div>

      {/* 🎮 Grid de Juegos */}
      {!juegos || juegos.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800 max-w-lg mx-auto">
          <p className="text-gray-400 text-xl font-body mb-4">
            No hay juegos en esta categoría aún.
          </p>
          <Link 
            href="/categorias" 
            className="text-pink-500 hover:text-pink-400 font-semibold font-heading transition"
          >
            ← Volver a categorías
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {juegos.map((juego) => (
            <Link 
              key={juego.id_producto} 
              href={`/juegos/${juego.id_producto}`}
              className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
            >
              {/* Imagen del juego */}
              {juego.url_imagen ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={juego.url_imagen} 
                    alt={juego.titulo}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="h-48 w-full bg-gray-800 flex items-center justify-center text-gray-600">
                  <span className="text-4xl">🎮</span>
                </div>
              )}

              {/* Info del juego */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white font-heading mb-2 group-hover:text-pink-500 transition-colors">
                  {juego.titulo}
                </h3>

                {juego.plataforma && (
                  <span className="inline-block bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded mb-3 font-body">
                    {juego.plataforma}
                  </span>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                  <span className="text-pink-500 text-xl font-bold font-heading">
                    {juego.precio} €
                  </span>
                  <span className="text-gray-400 text-sm group-hover:translate-x-1 transition-transform">
                    Ver más →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ⬅️ Botón Volver */}
      <div className="mt-16 text-center">
        <Link 
          href="/categorias" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-500 font-body transition-colors"
        >
          ← Volver a categorías
        </Link>
      </div>
      
    </div>
  )
}