import Image from "next/image";

export default function Home() {
  return (
    <main>
      <footer class="bg-gray-900 text-gray-300">
        <div class="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <h3 class="text-white text-lg font-bold">Top</h3>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="hover:text-white">Inicio</a>
            <a href="#" class="hover:text-white">Carrito</a>
            <a href="#" class="hover:text-white">Productos</a>
          </div>
        </div>
        
      </footer>
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
      <body class="flex flex-col min-h-screen">
        <footer class="bg-gray-800 text-white p-6 mt-auto">
          <div class="container mx-auto text-center">
            <p>&copy; Mi footer</p>
          </div>
        </footer>
      </body>
    </main>
  );
}

