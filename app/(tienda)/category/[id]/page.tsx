import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';

// Mapeo para corregir tildes y mayúsculas
const CATEGORY_NAME_MAP: Record<string, string> = {
  'accion': 'Acción',
  'clasificacion': 'Clasificación',
  'estrategia': 'Estrategia',
  'corazon': 'Corazón',
  'mision': 'Misión',
  'aventura': 'Aventura',
  'rpg': 'RPG',
  'deportes': 'Deportes',
  'simulacion': 'Simulación',
};

function formatCategoryName(nombre: string): string {
  const lower = nombre.toLowerCase();
  if (CATEGORY_NAME_MAP[lower]) return CATEGORY_NAME_MAP[lower];
  // Si no está en el mapa, capitaliza la primera letra
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();

  // 1️⃣ OBTENER CATEGORÍA
  // Usamos limit(1) y accedemos al índice [0] para evitar errores con .single()
  const { data: categoriaData, error: errorCategoria } = await supabase
    .from('categoria')
    .select('*')
    .eq('id_categoria', parseInt(id))
    .limit(1);

  const categoria = categoriaData && categoriaData.length > 0 ? categoriaData[0] : null;

  if (errorCategoria || !categoria) {
    notFound();
  }

  // 2️⃣ OBTENER PRODUCTOS
  const { data: productos, error: errorProductos } = await supabase
    .from('producto')
    .select(`
      id_producto,
      titulo,
      descripcion,
      precio,
      stock,
      imagen,
      plataforma,
      desarrollador,
      calificacion_pegi,
      fecha_lanzamiento,
      categoria:categoria(nombre)
    `)
    .eq('id_categoria', parseInt(id))
    // .gt('stock', 0)  <-- He comentado esto para que veas todos, 
                        //    quita las barras y el texto para volver a filtrar solo stock > 0
    .order('titulo', { ascending: true });

  if (errorProductos) {
    console.error('Error al cargar productos:', errorProductos);
  }

  const nombreFormateado = formatCategoryName(categoria.nombre);

  return (
    <main className="min-h-screen bg-gray-50">
      {/*  HEADER DE LA CATEGORÍA */}
      <section className="relative h-80 bg-gradient-to-r from-purple-900 to-blue-900 overflow-hidden flex items-center justify-center">
        {/* Imagen de fondo con baja opacidad */}
        {categoria.imagen && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={categoria.imagen}
              alt={nombreFormateado}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-xl">
            {nombreFormateado}
          </h1>
          
          {categoria.descripcion && (
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
              {categoria.descripcion}
            </p>
          )}
        </div>
      </section>

      {/* 🟩 GRID DE PRODUCTOS */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Juegos disponibles</h2>
          <span className="bg-purple-100 text-purple-800 px-5 py-2 rounded-full text-sm font-semibold shadow-sm">
            {productos?.length || 0} {productos?.length === 1 ? 'juego' : 'juegos'}
          </span>
        </div>

        {productos && productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((prod: any) => (
              <ProductCard key={prod.id_producto} producto={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-7xl mb-6 grayscale opacity-50">🎮</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No hay juegos disponibles
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Todavía no hemos añadido juegos a la categoría <strong>{nombreFormateado}</strong>. 
              ¡Vuelve pronto!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}