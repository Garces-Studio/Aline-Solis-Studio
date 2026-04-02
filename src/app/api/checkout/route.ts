import { NextResponse } from 'next/server';
import { crearPreferenciaPago } from '@/lib/mercado-pago';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Faltan productos o servicios' }, { status: 400 });
    }

    const initPoint = await crearPreferenciaPago(items[0].title, items[0].unit_price);

    if (!initPoint) {
      throw new Error('No se pudo generar el punto de inicio de pago');
    }
    
    return NextResponse.json({ url: initPoint });
  } catch (error: any) {
    console.error('Error en checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
