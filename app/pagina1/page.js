export default function Page() {
  return (
    <main>
        <header className="bg-gray-900 text-gray-300">
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
        
      </header>
      <div>
          190 linea  
      </div>
      <div>
          09 linea 
      </div>
      <div>
          78 linea 
      </div>
      <div>
          22 linea 
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
