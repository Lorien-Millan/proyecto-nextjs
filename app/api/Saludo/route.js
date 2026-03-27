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
    const body = await request.json();
    
    const { usuario, password } = body;
    
    if (!usuario || !password) {
      return Response.json({ 
        mensaje: "adios",
        error: "Faltan credenciales" 
      }, { status: 400 });
    }

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