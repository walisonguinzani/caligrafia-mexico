import { CheckoutError, createOrderCheckout } from './_lib/checkout-service.js';
import { json, siteUrl } from './_lib/http.js';
import { getStore } from './_lib/store.js';
import { createZenithClient } from './_lib/zenith.js';

// POST /api/checkout → crea (o recupera, si es un reintento) el checkout del pedido.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Solicitud inválida.' }, 400);
  }
  try {
    const result = await createOrderCheckout({
      body,
      siteUrl: siteUrl(request),
      zenith: createZenithClient(),
      store: getStore(),
    });
    return json(result, 201);
  } catch (err) {
    if (err instanceof CheckoutError) {
      return json({ error: err.message, code: err.code, ...err.extra }, err.status);
    }
    console.error('checkout', err?.code ?? err?.name);
    return json({ error: 'Ocurrió un error. Intenta de nuevo.', retry: true }, 500);
  }
}
