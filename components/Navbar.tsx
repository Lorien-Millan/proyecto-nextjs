'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Obtener usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    // Escuchar cambios en tiempo real (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
    router.push('/');
  };

  // Placeholder mientras carga para evitar saltos visuales
  if (loading) return <div className="h-16 bg-verde w-full" />;

  return (
    <nav className="bg-verde to-rosa text-white flex justify-between items-center sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <Image 
            src="/InicioLogo.png"
            alt="NerfThis Logo"
            width={353}
            height={40}
            />
      </Link>

        <div className="flex gap-6 items-center flex-1 max-w-md mx-8">
        <form 
            onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.querySelector('input');
            if (input?.value) {
                router.push(`/search?q=${encodeURIComponent(input.value)}`);
            }
            }}
            className="flex-1"
        >
            <div className="relative">
            <input
                type="text"
                placeholder="Buscar juegos..."
                className="w-full px-4 py-2 pl-10 bg-verde text-rosa rounded-3xl border-5 border-rosa focus:outline-none focus:border-rosa transition"
                style={{ '--tw-ring-color': 'var(--color-rosa-principal)' } as any}
            />
            <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            </div>
        </form>
        </div>

      {/* Enlaces y Usuario */}
      <div className="flex gap-6 items-center">
        <Link href="/carrito" className="text-lg font-bold font-heading hover:text-rosa-hover transition-colors flex items-center gap-2">
          🛒 Carrito
        </Link>

        {user ? (
          // 👇 SI ESTÁ LOGUEADO
          <div className="flex items-center gap-4">
            <span className="text-gray-800 font-semibold">
              Hola,
            </span>
            <span className="text-rosa text-2xl font-bold font-heading">
              {user.user_metadata?.nombre || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-rosa hover:bg-red-700 px-4 py-2 rounded-lg transition-colors border border-[#ff01eb]/50 text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          //  SI NO ESTÁ LOGUEADO
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-lg font-bold font-heading hover:text-rosa-hover transition-colors">
              🔑 Iniciar Sesión
            </Link>
            <Link href="/registro" className="bg-rosa text-white px-4 py-2 rounded-lg font-bold hover:bg-[#d600c4] transition-colors shadow-lg shadow-[#ff01eb]/30">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}