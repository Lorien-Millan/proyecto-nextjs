import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

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
    <div className="min-h-screen text-white p-6 md:p-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 font-heading text-pink-500">
        🎮 Categorías
      </h1>
      
      {categorias && categorias.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categorias.map((cat) => (
            <Link 
              key={cat.id_categoria} 
              href={`/categorias/${cat.nombre}`}
              className="group block overflow-hidden rounded-xl bg-verde-principal border-5 border-verde-principal hover:border-rosa-principal hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
            >
              {/* ️ Imagen de fondo */}
              <div className="relative h-100 w-full overflow-hidden">
                <Image
                  src={`/categorias/${cat.id_categoria}.jpg`} // Ruta de las imágenes
                  alt={`Categoría ${cat.nombre}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* 📝 Descripción debajo
              <div className="p-5">
                {cat.descripcion ? (
                  <p className="text-black text-center leading-relaxed line-clamp-3 font-body">
                    {cat.descripcion}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm italic font-body">Sin descripción disponible</p>
                )}
                
                <span className="text-pink-500 text-sm mt-4 inline-block font-semibold group-hover:translate-x-1 transition-transform">
                  Ver juegos →
                </span>
              </div> */}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-900/50 rounded-xl border border-gray-800 max-w-lg mx-auto">
          <p className="text-gray-400 text-lg mb-2 font-body">No hay categorías disponibles</p>
          <p className="text-sm text-gray-600 font-body">Añade categorías desde Supabase para comenzar</p>
        </div>
      )}
    </div>
  )
}