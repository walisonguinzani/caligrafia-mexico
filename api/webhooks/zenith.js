import { json } from '../_lib/http.js';
import { getStore } from '../_lib/store.js';
import { handleWebhook, notifyFulfillment } from '../_lib/webhook.js';

// POST /api/webhooks/zenith → confirmación firmada de Zenith.
// Se lee el cuerpo crudo (texto) para validar la firma HMAC antes de parsear.
export async function POST(request) {
  const rawBody = await request.text();
  const result = await handleWebhook({
    rawBody,
    headers: request.headers,
    secret: process.env.ZENITH_WEBHOOK_SECRET,
    store: getStore(),
    onPaid: notifyFulfillment,
  });
  if (result.status !== 200) console.warn('webhook rechazado', result.body.error);
  return json(result.body, result.status);
}
