import "./globals.css";
import type { Metadata } from "next";
import { Orbitron, Bitcount_Prop_Single } from "next/font/google";
import Link from 'next/link';
import Image from 'next/image';

// Fuente para títulos
const orbitron = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

// Fuente para cuerpo/texto normal
const bitcount_Prop_Single = Bitcount_Prop_Single({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NerfThis Game Shop",
  description: "Videojuegos a precios ridículamente bajos",
};

export default function RootLayout({
  children,
}: Readonly) {
  return (
    <html lang="es">
      <body className={`${orbitron.variable} ${bitcount_Prop_Single.variable} font-body text-white`}>
        {/* NAVBAR */}

        <nav className={`font-heading font-bold flex items-center gap-6 bg-green-200 text-rosa-principal`}>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Image 
              src="/InicioLogo.png"
              alt="NerfThis Logo"
              width={353}
              height={40}
            />
          </Link>
          
          <Link href="/categorias" className="hover:opacity-80 transition">
            📂 Categorías
          </Link>
          
          <Link href="/carrito" className="hover:opacity-80 transition">
            🛒 Carrito
          </Link>
          
          <Link href="/login" className="hover:opacity-80 transition">
            🔑 Login
          </Link>
          
          <Link href="/registro" className="hover:opacity-80 transition">
            Registro
          </Link>

        </nav>
        <p className= "p-1 font-body bg-gray-100 text-gray-400 text-center">
          "Videojuegos a precios RIDÍCULAMENTE bajos"
        </p>

        {/* CONTENIDO DE CADA PÁGINA */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}