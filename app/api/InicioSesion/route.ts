import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, contraseña } = body;

    
    if (!email || !contraseña) {
        return NextResponse.json(
            { error: 'Faltan datos' },
            { status: 400 }
        );
    }

    
    const usuario = {
        email: 'test@gmail.com',
        contraseña: '123456'
    };

    
    if (email !== usuario.email || contraseña !== usuario.contraseña) {
        return NextResponse.json(
            { error: 'Usuario o contraseña incorrectos' },
            { status: 401 }
        );
    }

    
    return NextResponse.json(
        { message: 'Buenos días' },
        { status: 200 }
    );

    } catch (error) {
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        );
    }
}