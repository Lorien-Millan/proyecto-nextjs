import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
    <main>
<<<<<<< HEAD
      
      <header class="bg-gray-900 text-gray-300">
        <div class="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <h3 class="text-white text-lg font-bold">Top</h3>
          </div>
          
          <div class="flex space-x-6">
            <a href="/page.tsx" class="hover:text-white">Inicio</a>
            <a href="/pagina1" class="hover:text-white">Carrito</a>
            <a href="/pagina2" class="hover:text-white">Productos</a>
          </div>
        </div>
        <div>
            <search />
        </div>
      </header>
      
=======
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-white text-lg font-bold">Top</h3>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">Inicio</a>
            <a href="#" className="hover:text-white">Carrito</a>
            <a href="#" className="hover:text-white">Productos</a>
          </div>
        </div>
      </footer>

>>>>>>> 61f550d9c9c140f9f0a7fdf47f7920ba6dae8e2d
      <div>
          1 linea  
      </div>
      <div>
          2 linea 
      </div>
      <div>
          3 linea 
      </div>
      <div>
          4 linea 
      </div>
      
      <body className="flex flex-col min-h-screen">
        <footer className="bg-gray-800 text-white p-6 mt-auto">
          <div className="container mx-auto text-center">
            <p>&copy; Mi footer</p>
          </div>
        </footer>
      </body>
    </main>
  );
}

