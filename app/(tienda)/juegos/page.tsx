import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

// Helper para formatear nombres de categoría (Acción, RPG, etc.)
const CATEGORY_NAME_MAP: Record<string, string> = {
  'accion': 'Acción', 'clasificacion': 'Clasificación', 'estrategia': 'Estrategia',
  'corazon': 'Corazón', 'mision': 'Misión', 'aventura': 'Aventura', 'simulacion': 'Simulación'
};

function formatCategoryName(nombre: string): string {
  const lower = nombre.toLowerCase();
  if (CATEGORY_NAME_MAP[lower]) return CATEGORY_NAME_MAP[lower];
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
}

export default async function JuegosPage() {
  const supabase = createServerClient();

  // 1. Consulta actualizada: Asegúrate de incluir 'precio_original'
  const { data: productos, error } = await supabase
    .from('producto')
    .select(`
      id_producto,
      titulo,
      descripcion,
      precio,
      precio_original, 
      stock,
      imagen,
      plataforma,
      categoria:categoria(nombre)
    `)
    .order('id_producto', { ascending: false }); // Los más nuevos primero

  if (error) {
    console.error('Error al cargar el catálogo:', error);
  }

  return (
    <main className="bg-gradient-to-r from-verde to-rosa min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* 🔝 Header de la página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-4xl font-heading text-gray-900">
              🎮 Catálogo Completo
            </h1>
            <p className="text-gray-600 mt-2">
              {productos?.length || 0} juegos disponibles
            </p>
          </div>
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-rosa transition-colors font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
          >
            ← Volver al inicio
          </Link>
        </div>

        {/* 🟩 Grid de productos */}
        {productos && productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((prod: any) => {
              // 2. Lógica para detectar si hay descuento
              const tieneDescuento = prod.precio_original && prod.precio_original > prod.precio;
              const categoriaDisplay = prod.categoria?.nombre 
                ? formatCategoryName(prod.categoria.nombre) 
                : 'General';

              return (
                <Link 
                  key={prod.id_producto} 
                  href={`/product/${prod.id_producto}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-rosa/30 flex flex-col"
                >
                  {/* Imagen */}
                  <div className="relative h-48 bg-gray-800 overflow-hidden">
                    {prod.imagen ? (
                      <Image 
                        src={prod.imagen} 
                        alt={prod.titulo} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-4xl">🎮</div>
                    )}
                    
                    {/* Badge de Stock */}
                    {prod.stock === 0 && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                        AGOTADO
                      </div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Categoría */}
                    <span className="text-xs font-bold text-rosa uppercase tracking-wide mb-1">
                      {categoriaDisplay}
                    </span>

                    {/* Título */}
                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-rosa transition-colors">
                      {prod.titulo}
                    </h3>

                    {/* Espacio flexible para empujar el precio abajo */}
                    <div className="flex-grow"></div>

                    {/* 💰 PRECIO CON DESCUENTO */}
                    <div className="flex items-end gap-2 mt-2">
                      {tieneDescuento ? (
                        <>
                          <span className="text-sm text-gray-400 line-through mb-1">
                            {prod.precio_original.toFixed(2)}€
                          </span>
                          <span className="text-xl font-extrabold text-red-600">
                            {prod.precio.toFixed(2)}€
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-extrabold text-gray-900">
                          {prod.precio.toFixed(2)}€
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4 opacity-50">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay juegos en el catálogo
            </h3>
            <p className="text-gray-500">
              Estamos preparando nuevos lanzamientos. ¡Vuelve pronto!
            </p>
          </div>
        )}

      </div>
    </main>
  );
}