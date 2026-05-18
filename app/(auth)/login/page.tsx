'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Intentar iniciar sesión
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) throw loginError;

      // Si llega aquí, el login fue exitoso
      // Redirigir a la página principal
      router.push('/');
      router.refresh(); // Refrescar para actualizar el estado de autenticación

    } catch (err: any) {
      // Manejo de errores comunes de Supabase
      if (err.message.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos');
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-verde/20 to-rosa/20 py-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        {/* Tarjeta de login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4" style={{ borderColor: 'var(--color-rosa-principal)' }}>
          
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading mb-2" style={{ color: 'var(--color-rosa-principal)' }}>
              Bienvenido
            </h1>
            <p className="text-gray-600">
              Inicia sesión en NerfThis Game Shop
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
              <p className="font-semibold">❌ Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-rosa focus:border-transparent transition-all"
                style={{ '--tw-ring-color': 'var(--color-rosa-principal)' } as any}
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                {/* recuperar contraseña */}
                {/* <Link href="/forgot-password" className="text-sm text-rosa hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link> */}
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-rosa focus:border-transparent transition-all"
                style={{ '--tw-ring-color': 'var(--color-rosa-principal)' } as any}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              style={{ backgroundColor: 'var(--color-rosa-principal)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando...
                </span>
              ) : (
                '🔑 Iniciar sesión'
              )}
            </button>
          </form>

          {/* Link a registro */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="font-semibold hover:underline" style={{ color: 'var(--color-rosa-principal)' }}>
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Tus datos están protegidos y encriptados
        </p>
      </div>
    </main>
  );
}