'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    }
  }, [carrito, isLoaded]);

  const agregarAlCarrito = (producto: ProductoCarrito) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id_producto === producto.id_producto);
      
      if (existe) {
        // Si ya existe, aumentar cantidad (si no supera el stock)
        if (existe.cantidad < producto.stock) {
          return prev.map((item) =>
            item.id_producto === producto.id_producto
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        }
        return prev; // No hacer nada si ya tiene el máximo
      }
      
      // Si no existe, agregar con cantidad 1
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

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Calcular total del carrito
  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  // Calcular cantidad total de items
  const cantidadTotal = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        totalCarrito,
        cantidadTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
}