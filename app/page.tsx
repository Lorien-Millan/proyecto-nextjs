import { createClient } from '@/utils/supabase/server';
import TopVentas from '@/components/TopVentas';
import GridCategorias from '@/components/GridCategorias';

export default async function Home() {
  const supabase = createClient();

  // Consulta para obtener los 3 productos más vendidos
  const { data: topVentas, error: errorTop } = await supabase
    .from('detalles_pedido')
    .select(`
      id_producto,
      producto:producto (
        id_producto,
        titulo,
        precio,
        url_imagen,
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
      <section className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            🎮 GameStore
          </h1>
          <p className="text-center text-xl text-gray-300 mb-12">
            Los mejores videojuegos al mejor precio
          </p>
          
          <TopVentas productos={productosConVentas} />
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Explora por Categorías
        </h2>
        <GridCategorias categorias={categorias || []} />
      </section>
    </main>
  );
}