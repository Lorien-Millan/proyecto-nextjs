import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {             //AQUI SE LLEVA A CABO LA PETICION GET
  try {
    // Leer parámetros de la URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(Number(id))) {                 //SE HACE UNA LLAMADA A UN JUEGO
      return NextResponse.json({ error: 'Parámetro "id" inválido o faltante' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Consulta a la BD
    const { data, error } = await supabase          //SE COMPRUEBA SI EXISTE EN LA BD Y SI HAY JUEGOS RESTANTES
      .from('producto')
      .select('id_producto, titulo, stock, precio, precio_original')
      .eq('id_producto', parseInt(id))
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Respuesta JSON
    return NextResponse.json({
      id: data.id_producto,
      titulo: data.titulo,
      stock: data.stock,
      precio: data.precio,
      precio_original: data.precio_original || null,
      disponible: data.stock > 0
    });

  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar el producto' }, { status: 500 });
  }
}