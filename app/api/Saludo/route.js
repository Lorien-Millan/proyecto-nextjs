// GET request
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuario = searchParams.get('usuario');
    
    return Response.json({ 
      mensaje: "hola",
      usuario: usuario || "invitado"
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
    
    // Ejemplo: validar credenciales
    const { usuario, password } = body;
    
    if (!usuario || !password) {
      return Response.json({ 
        mensaje: "adios",
        error: "Faltan credenciales" 
      }, { status: 400 });
    }
    
    // Aquí iría tu lógica de autenticación
    // Por ahora simulamos un login exitoso
    
    return Response.json({ 
      mensaje: "hola",
      token: "token-ejemplo-123",
      usuario: usuario
    });
  } catch (error) {
    return Response.json({ 
      mensaje: "adios",
      error: error.message 
    }, { status: 500 });
  }
}