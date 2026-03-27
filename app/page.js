'use client';

import {useState} from 'react';
import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  const [resultado, setResultado] = useState('Esperando petición...');

  // Función para hacer peticiones de tipo POST
  const hacerPeticion = async (ruta, datos) => {
    try {
      setResultado(`Conectando con ${ruta}...`);
      
      const response = await fetch(ruta, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      });
      
      const data = await response.json();
      
      // Mostrar peticion
      setResultado(`Respuesta de ${ruta}: ${JSON.stringify(data)}`);
      
    } catch (error) {
      setResultado(`Error: ${error.message}`);
    }
  };

  return (
    <main>
            
      <header className="bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-white text-lg font-bold">Top</h3>
          </div>
        
          <div className="flex space-x-6">
            <a href="/#" className="hover:text-white">Inicio</a>
            <a href="/pagina1" className="hover:text-white">hola</a>
            <a href="/pagina2" className="hover:text-white">Carrito</a>
            
            {/* Botones que llaman a la función hacerPeticion */}
            <button 
              onClick={() => hacerPeticion('/api/Saludo', { nombre: "Usuario", mensaje: "test" })}
              className="hover:text-white bg-transparent border-none cursor-pointer text-inherit font-inherit"
            >
              Productos (API Saludo)
            </button>
            
            <button 
              onClick={() => hacerPeticion('/api/InicioSesion', { usuario: "admin", password: "123" })}
              className="hover:text-white bg-transparent border-none cursor-pointer text-inherit font-inherit"
            >
              Iniciar sesión (API Login)
            </button>
          </div>
        </div>
      
      </header>
      
      {/* Mostrar la peticion */}
      <div className="p-4 bg-gray-100 text-black m-4 rounded">
        <strong>Estado de la petición:</strong> {resultado}
      </div>

      <div>1 linea</div>
      <div>2 linea</div>
      <div>3 linea</div>
      <div>4 linea</div>
      
      <footer className="bg-gray-800 text-white p-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; Mi footer</p>
        </div>
      </footer>
    </main>
  );
}