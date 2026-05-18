import "./globals.css";
import type { Metadata } from "next";
import { Orbitron, Unbounded } from "next/font/google";
import { CarritoProvider } from '@/contexts/CarritoContext';
import Navbar from '@/components/Navbar';

// Fuente para títulos
const orbitron = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

// Fuente para cuerpo/texto normal
const unbounded = Unbounded({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NerfThis Game Shop",
  description: "Videojuegos a precios ridículamente bajos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${orbitron.variable} ${unbounded.variable} font-body text-white`}>
        <CarritoProvider>
          {/*  Navbar Dinámico */}
          <Navbar />
          <main>
            {children}
          </main>
        </CarritoProvider>
      </body>
    </html>
  );
}