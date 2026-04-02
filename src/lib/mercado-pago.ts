import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-0000000000000000-000000-0000000000000000000000000000' 
});

export const crearPreferenciaPago = async (titulo: string, precio: number) => {
  const preference = new Preference(client);
  
  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'reserva-cita',
            title: titulo,
            unit_price: Number(precio),
            quantity: 1,
            currency_id: 'MXN'
          }
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/confirmacion`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/confirmacion`
        },
        auto_return: 'approved',
      }
    });

    return result.init_point;
  } catch (error) {
    console.error('Error creando preferencia MP:', error);
    return null;
  }
};
