'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface ProductoCarrito {
  id_producto: number;
  titulo: string;
  precio: number;
  imagen: string | null;
  cantidad: number;
  stock: number;
}

interface CarritoContextType {
  carrito: ProductoCarrito[];
  agregarAlCarrito: (producto: ProductoCarrito) => void;
  eliminarDelCarrito: (id: number) => void;
  actualizarCantidad: (id: number, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalCarrito: number;
  cantidadTotal: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [userId, setUserId] = useState<string>('guest'); // Por defecto es invitado
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Escuchar autenticación y cargar el carrito correcto
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Cargar estado inicial
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser();
      const id = data.user?.id || 'guest';
      setUserId(id);
      
      const saved = localStorage.getItem(`carrito_${id}`);
      setCarrito(saved ? JSON.parse(saved) : []);
      setIsLoaded(true);
    };
    initAuth();

    // Suscribirse a cambios (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newId = session?.user?.id || 'guest';
      setUserId(newId);
      
      // Cambiar al carrito de la nueva cuenta
      const saved = localStorage.getItem(`carrito_${newId}`);
      setCarrito(saved ? JSON.parse(saved) : []);
      setIsLoaded(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Guardar en localStorage cuando cambia el carrito
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`carrito_${userId}`, JSON.stringify(carrito));
    }
  }, [carrito, userId, isLoaded]);

  const agregarAlCarrito = (producto: ProductoCarrito) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id_producto === producto.id_producto);
      if (existe) {
        return prev.map((item) =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((item) => item.id_producto !== id));
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setCarrito((prev) =>
      prev.map((item) =>
        item.id_producto === id ? { ...item, cantidad } : item
      )
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const totalCarrito = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito, totalCarrito, cantidadTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (context === undefined) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return context;
}