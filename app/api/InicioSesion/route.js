// GET request
export async function GET(request) {
  try {
    // Si necesitas leer parámetros de la URL
    const { searchParams } = new URL(request.url);
    const nombre = searchParams.get('nombre');
    
    return Response.json({ 
      mensaje: "hola",
      dato: nombre || "sin nombre"
    });
  } catch (error) {
    return Response.json({ 
      mensaje: "adios",
      error: error.message 
    }, { status: 500 });
  }
}

// POST request
export async function POST(request) {
  try {
    // Leer el JSON del body
    const body = await request.json();
    
    // Validar que recibimos datos
    if (!body) {
      return Response.json({ 
        mensaje: "adios",
        error: "No se recibieron datos" 
      }, { status: 400 });
    }
    
    return Response.json({ 
      mensaje: "hola",
      datosRecibidos: body
    });
  } catch (error) {
    return Response.json({ 
      mensaje: "adios",
      error: error.message 
    }, { status: 500 });
  }
}