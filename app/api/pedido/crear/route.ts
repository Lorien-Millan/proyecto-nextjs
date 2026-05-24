import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Leer el JSON enviado
    const body = await request.json();
    const { userId, items, total } = body;

    if (!userId || !items || items.length === 0 || !total) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const supabase = createServerClient();

    // 2. Insertar en tabla 'pedido'
    const { data: pedido, error: errorPedido } = await supabase
      .from('pedido')
      .insert({
        id_usuario: 1,
        total_pagar: total,
        estado: 'pendiente',
        fecha: new Date().toISOString()
      })
      .select('id_pedido')
      .single();

    if (errorPedido) throw errorPedido;

    // 3. Insertar en tabla 'detalles_pedido'
    // Nota: tu tabla no tiene columna 'cantidad', así que se guarda 1 fila por producto
    const detalles = items.map((item: any) => ({
      id_pedido: pedido.id_pedido,
      id_producto: item.id_producto,
      precio_compra: item.precio
    }));

    const { error: errorDetalles } = await supabase
      .from('detalles_pedido')
      .insert(detalles);

    if (errorDetalles) throw errorDetalles;

    // 4. Respuesta JSON exitosa
    return NextResponse.json({
      success: true,
      id_pedido: pedido.id_pedido,
      message: 'Pedido creado correctamente'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}