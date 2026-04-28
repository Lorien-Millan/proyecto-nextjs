import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NerfThis Game Shop",
  description: "Videojuegos a precios ridículamente bajos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="es">
    //   <body>
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //     {children}
    //   </body>
    // </html>

    <html lang="es">
      <body className="font-sans antialiased">
        {/* NAVBAR */}
        <nav className="flex gap-4 p-4 bg-gray-100 border-b">
          <Link href="/" className="font-bold">🏠 Inicio</Link>
          <Link href="/categorias">📂 Categorías</Link>
          <Link href="/carrito"> Carrito</Link>
          <Link href="/inicioSesion">🔑 Login</Link>
          <Link href="/registro"> Registro</Link>
        </nav>

        {/* CONTENIDO DE CADA PÁGINA */}
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
