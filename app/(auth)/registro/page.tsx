'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // 1. Registrar en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
          },
        },
      });

      if (authError) throw authError;

      // 2. Crear perfil en la tabla 'perfil_usuario' (NO en 'usuario')
      if (authData.user) {
        const { error: dbError } = await supabase
          .from('perfil_usuario')  // 👈 Tabla nueva
          .insert([
            {
              id: authData.user.id,  // UUID de Supabase Auth
              email: formData.email,
              nombre: formData.nombre,
              rol: 'user',
              fecha_registro: new Date().toISOString(),
            },
          ]);

        if (dbError) throw dbError;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/login?registrado=true');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Error al registrar el usuario');
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
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4" style={{ borderColor: 'var(--color-rosa-principal)' }}>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading mb-2" style={{ color: 'var(--color-rosa-principal)' }}>
              Crear Cuenta
            </h1>
            <p className="text-gray-600">Únete a NerfThis Game Shop</p>
          </div>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
              <p className="font-semibold">✅ ¡Registro exitoso!</p>
              <p className="text-sm">Redirigiendo al login...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">❌ Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {/* Nombre */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rosa focus:border-transparent transition-all"
                placeholder="Tu nombre"
              />
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rosa focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>
            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rosa focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            {/* Confirmar contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rosa focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            {/* Botón registro */}
            <button
              type="submit"
              disabled={loading || success}
              className="font-heading w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ backgroundColor: 'var(--color-rosa-principal)' }}
            >
              {loading ? 'Registrando...' : '🚀 Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-rosa-principal)' }}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}