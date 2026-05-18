'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
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
          desarrollador,
          calificacion_pegi,
          categoria:categoria(nombre)
        `)
        .or(`titulo.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%,plataforma.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      setResults(productos || []);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Barra de búsqueda */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            🔍 Buscar Juegos
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, descripción, plataforma..."
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rosa text-lg"
                style={{ '--tw-ring-color': 'var(--color-rosa-principal)' } as any}
              />
              <button
                type="submit"
                className="px-8 py-3 bg-rosa text-white font-bold rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: 'var(--color-rosa-principal)' }}
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Buscando juegos...</p>
          </div>
        ) : hasSearched ? (
          <div>
            <p className="text-gray-600 mb-6">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'} 
              {query && ` para "${query}"`}
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((producto) => (
                  <Link
                    key={producto.id_producto}
                    href={`/product/${producto.id_producto}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-800">
                      {producto.imagen ? (
                        <Image
                          src={producto.imagen}
                          alt={producto.titulo}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-4xl">
                          🎮
                        </div>
                      )}
                      
                      {producto.stock === 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          SIN STOCK
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">
                        {producto.titulo}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {producto.descripcion}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-rosa">
                          {producto.precio?.toFixed(2)}€
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {producto.plataforma || 'Multiplataforma'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No encontramos juegos
                </h3>
                <p className="text-gray-600">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ¿Qué estás buscando?
            </h3>
            <p className="text-gray-600">
              Escribe un término para buscar juegos por título, descripción o plataforma
            </p>
          </div>
        )}
      </div>
    </main>
  );
}