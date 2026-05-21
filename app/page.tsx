import { createServerClient } from '@/lib/supabase/server'
import TopVentas from '@/components/TopVentas';
import GridCategorias from '@/components/GridCategorias';
import Link from 'next/link';

export default async function Home() {
  const supabase = createServerClient();

  // Consulta para obtener los 3 productos más vendidos
  const { data: topVentas, error: errorTop } = await supabase
    .from('detalles_pedido')
    .select(`
      id_producto,
      producto:producto (
        id_producto,
        titulo,
        precio,
        imagen,
        stock,
        categoria:categoria (
          nombre
        )
      )
    `)
    .limit(100); // Obtenemos todos los detalles para contar

  // Consulta para obtener todas las categorías
  const { data: categorias, error: errorCategorias } = await supabase
    .from('categoria')
    .select('*')
    .order('nombre', { ascending: true });

  if (errorTop) {
    console.error('Error al obtener top ventas:', errorTop);
  }

  if (errorCategorias) {
    console.error('Error al obtener categorías:', errorCategorias);
  }

  // Procesar top ventas: contar cuántas veces aparece cada producto
  const ventasPorProducto: Record<string, number> = {};
  
  topVentas?.forEach((detalle: any) => {
    const idProducto = detalle.id_producto;
    ventasPorProducto[idProducto] = (ventasPorProducto[idProducto] || 0) + 1;
  });

  // Crear array con productos y su cantidad de ventas
  const productosConVentas = Object.entries(ventasPorProducto)
    .map(([idProducto, cantidad]) => {
      const productoData = topVentas?.find((p: any) => p.id_producto === parseInt(idProducto));
      return {
        ...productoData?.producto,
        ventas: cantidad
      };
    })
    .sort((a, b) => (b.ventas || 0) - (a.ventas || 0)) // Ordenar por más ventas
    .slice(0, 3); // Tomar solo los top 3

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section con Top Ventas */}
      <section className="bg-gradient-to-r from-verde to-rosa text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-shadow-lg text-4xl md:text-9xl font-heading text-center mb-4 p-7 pb-20">
            BIENVENIDO
          </h1>
          
          <TopVentas productos={productosConVentas} />
        </div>
      </section>

      {/* Sección de Categorías */}
      <div className="bg-gradient-to-r from-verde to-rosa">
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            <span className="bg-verde text-black px-5 py-3 rounded-full text-2xl font-semibold">
            Explora por Categorías
            </span>
          </h2>
          <GridCategorias categorias={categorias || []} />
        </section>
      </div>

      {/* Enlace a todos los juegos */}
      <section className="container mx-auto px-4 py-8 text-center">
        <Link href="/juegos" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Ver todos los productos
        </Link>
      </section>
    </main>
  );
}