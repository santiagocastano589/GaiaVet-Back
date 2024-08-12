import { MercadoPagoConfig, Payment } from 'mercadopago';

// Configura el cliente con el token de acceso
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-3818383839944816-081216-022444e733b858b775cf5399cb7dd829-1944139488",
  options: { timeout: 5000, idempotencyKey: 'abc' }
});

// Inicializa la API de pagos
const payment = new Payment(client);

export { payment };
