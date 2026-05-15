'use client';

import { useCarrito } from '@/contexts/CarritoContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CarritoPage() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, totalCarrito, vaciarCarrito } = useCarrito();

  if (carrito.length === 0) {
    return (
      <main className="bg-gradient-to-r from-verde to-rosa min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">
              ¡Aún no has añadido ningún juego al carrito!
            </p>
            <Link
              href="/"
              className="inline-block bg-rosa text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-rosa-hover transition-all shadow-lg"
            >
              Ir a la tienda
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-verde to-rosa py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">🛒 Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {carrito.map((producto) => (
              <div
                key={producto.id_producto}
                className="bg-white rounded-xl shadow-lg p-6 flex gap-6"
              >
                {/* Imagen */}
                <div className="relative w-32 h-32 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
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
                </div>

                {/* Información */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {producto.titulo}
                    </h3>
                    <p className="text-black text-2xl font-bold text-rosa-principal">
                      {producto.precio.toFixed(2)}€
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Control de cantidad */}
                    <div className="text-black flex items-center gap-3">
                      <button
                        onClick={() =>
                          actualizarCantidad(
                            producto.id_producto,
                            producto.cantidad - 1
                          )
                        }
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {producto.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          actualizarCantidad(
                            producto.id_producto,
                            producto.cantidad + 1
                          )
                        }
                        disabled={producto.cantidad >= producto.stock}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => eliminarDelCarrito(producto.id_producto)}
                      className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Botón vaciar carrito */}
            <button
              onClick={vaciarCarrito}
              className="text-gray-500 hover:text-gray-700 font-semibold text-sm underline"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{totalCarrito.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-semibold">GRATIS</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-3xl font-bold font-heading text-rosa">
                      {totalCarrito.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-rosa text-white py-4 rounded-xl font-bold font-heading text-2xl shadow-lg hover:bg-rosa-hover transition-all mb-4">
                Finalizar Compra
              </button>

              <Link
                href="/"
                className="block text-center text-gray-600 hover:text-gray-800 font-semibold"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}