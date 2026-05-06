import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  const supabase = createServerClient()

  // 🏆 1. TOP VENTAS - Contamos filas en detalles_pedido
  const { data: detalles, error: ventasError } = await supabase
    .from('detalles_pedido')
    .select(`
      id_producto,
      pedido (estado)
    `)
    .not('pedido.estado', 'eq', 'cancelado')

  let topVentas: any[] = []

  if (detalles && !ventasError) {
    // Agrupamos por producto y contamos ocurrencias
    const salesMap: Record<string, any> = {}
    
    detalles.forEach((item: any) => {
      const prodId = item.id_producto
      if (prodId) {
        if (!salesMap[prodId]) {
          salesMap[prodId] = { 
            id_producto: prodId,
            total_vendidos: 0 
          }
        }
        salesMap[prodId].total_vendidos += 1 // Cada fila = 1 unidad
      }
    })

    // Obtenemos la información completa de los productos más vendidos
    const topProductIds = Object.values(salesMap)
      .sort((a: any, b: any) => b.total_vendidos - a.total_vendidos)
      .slice(0, 3)
      .map((p: any) => p.id_producto)

    if (topProductIds.length > 0) {
      const { data: productos, error: prodError } = await supabase
        .from('producto')
        .select('id_producto, titulo, url_imagen, precio')
        .in('id_producto', topProductIds)

      if (productos && !prodError) {
        // Combinamos con las ventas
        topVentas = productos.map(prod => ({
          ...prod,
          total_vendidos: salesMap[prod.id_producto].total_vendidos
        }))
        // Ordenamos de nuevo por ventas
        topVentas.sort((a, b) => b.total_vendidos - a.total_vendidos)
      }
    }
  }

  // 📂 2. TODAS LAS CATEGORÍAS
  const { data: categorias, error: catError } = await supabase
    .from('categoria')
    .select('id_categoria, nombre, descripcion')
    .order('nombre')

  // Manejo básico de errores
  if (ventasError || catError) {
    console.error('Error cargando inicio:', ventasError || catError)
  }

  return (
    <div className="min-h-screen text-white font-body">
      {/* 🔥 SECCIÓN: TOP VENTAS */}
      <section className="mt-20 max-w-7xl mx-auto px-6 mb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🔥</span>
          <h2 className="text-3xl md:text-4xl font-heading text-[#ff01eb]">
            Top Ventas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topVentas.length > 0 ? topVentas.map((juego, index) => (
            <Link
              key={juego.id_producto}
              href={`/juegos/${juego.id_producto}`}
              className="group relative overflow-hidden rounded-2xl bg-[#c3ffca] border-2 border-[#ff01eb] hover:shadow-[0_0_25px_rgba(255,1,235,0.4)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Badge de posición */}
              <div className="absolute top-3 left-3 z-20 bg-black text-[#ff01eb] font-heading font-bold w-8 h-8 flex items-center justify-center rounded-full border border-[#ff01eb]">
                {index + 1}
              </div>

              <div className="relative h-72 w-full">
                <Image
                  src={juego.url_imagen || '/placeholder-game.jpg'}
                  alt={juego.titulo}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-2xl font-heading text-white truncate drop-shadow-md">
                    {juego.titulo}
                  </h3>
                  <p className="text-[#ff01eb] font-bold text-xl mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {juego.precio} €
                  </p>
                </div>
              </div>
            </Link>
          )) : (
            <p className="text-gray-500 col-span-3 text-center py-10">Aún no hay ventas registradas.</p>
          )}
        </div>
      </section>

      {/* 📂 SECCIÓN: CATEGORÍAS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">📂</span>
          <h2 className="text-3xl md:text-4xl font-heading text-[#ff01eb]">
            Categorías
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias?.map((cat) => (
            <Link
              key={cat.id_categoria}
              // Generamos el slug limpiando tildes y espacios automáticamente
              href={`/categorias/${cat.nombre.toLowerCase().replace(/ /g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
              className="group block overflow-hidden rounded-xl bg-[#c3ffca] border-2 border-[#ff01eb] hover:border-[#ff01eb] hover:shadow-[0_0_20px_rgba(255,1,235,0.3)] transition-all duration-300"
            >
              <div className="relative h-44 w-full bg-gray-800 overflow-hidden">
                <Image
                  src={`/categorias/${cat.id_categoria}.jpg`}
                  alt={cat.nombre}
                  fill
                  className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-3xl font-heading text-white text-center px-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {cat.nombre}
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-[#c3ffca]">
                <p className="text-gray-900 text-sm leading-relaxed line-clamp-2">
                  {cat.descripcion || 'Explora nuestra selección de juegos'}
                </p>
                <span className="mt-3 inline-block text-[#ff01eb] font-bold text-sm group-hover:translate-x-2 transition-transform">
                  Ver catálogo →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}