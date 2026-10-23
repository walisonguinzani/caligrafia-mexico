# Caligrafía desde Cero · Landing page + checkout

Landing page en español (México) del **Paquete Completo de Caligrafía** ($200 MXN, garantía de 30 días) con checkout propio integrado a la **Zenith Payments API** (OXXO y SPEI) y 2 order bumps.

## Estructura
| Ruta | Qué es |
|---|---|
| `index.html` | Landing page |
| `checkout.html` | Checkout: datos, order bumps, forma de pago e instrucciones de pago |
| `gracias.html` | Página de retorno: espera la confirmación y muestra el acceso |
| `api/payment-methods.js` | `GET` formas de pago disponibles (consulta a Zenith en tiempo real) |
| `api/checkout.js` | `POST` crea el checkout (idempotente) |
| `api/checkout-status.js` | `GET` estado del pedido para la pantalla del comprador |
| `api/webhooks/zenith.js` | `POST` webhook firmado: **única** confirmación de pago |
| `api/_lib/` | Cliente Zenith, precios, validación, base de datos, webhook |
| `tests/` | Pruebas (`npm test`) |
| `tools/dev-server.js` | Servidor local, con modo simulado |
| `bonos/` | Los 5 bonos en PDF |

## Oferta y order bumps
Los precios están **solo en el servidor** (`api/_lib/pricing.js`), en centavos:
- Paquete Completo: 20000 ($200 MXN)
- Acceso de por vida: 5000 ($50 MXN)
- Grupo VIP de WhatsApp: 5000 ($50 MXN)

## Cómo funciona el pago
1. `checkout.html` consulta `/api/payment-methods` y muestra solo los métodos que Zenith devuelve para MX/MXN.
2. Al enviar, el navegador manda un `requestId` (UUID). El servidor guarda una `Idempotency-Key` propia para esa intención y el payload exacto. Si hay timeout o error 5xx, el reintento usa **la misma llave y el mismo payload**; nunca se duplica el cobro.
3. El comprador ve el `nextAction` tal como lo devuelve Zenith (referencia OXXO con código de barras, datos SPEI, redirect, etc.).
4. El pedido se marca pagado **solo** con el webhook firmado (`payment.captured` o `checkout.succeeded`), validando HMAC SHA-256, ventana de 300 s, `X-Zenith-Event-Id` único, `referenceId`, monto y moneda.
5. `gracias.html` muestra `ACCESS_URL` (y `VIP_GROUP_URL` si compró el bump) únicamente después de esa confirmación.

## Configuración en Vercel
1. Importa este repositorio en Vercel (framework: *Other*, sin build).
2. En **Storage**, crea una base **Upstash Redis / KV** y conéctala al proyecto (crea `KV_REST_API_URL` y `KV_REST_API_TOKEN`).
3. En **Settings → Environment Variables**, agrega las variables de `.env.example`. La secret de Zenith y la del webhook **nunca** van en el código.
4. Genera un secreto para el webhook (por ejemplo `openssl rand -hex 32`) y guárdalo como `ZENITH_WEBHOOK_SECRET`.
5. Registra el webhook en Zenith (una sola vez, desde tu computadora):
   ```bash
   curl -X POST https://api.zenithworld.com.br/integrations/webhooks/endpoints \
     -H "X-API-Key: $ZENITH_PUBLIC_KEY" -H "X-API-Secret: $ZENITH_SECRET_KEY" \
     -H "Content-Type: application/json" \
     -d '{"name":"Caligrafía pedidos","url":"https://TU-DOMINIO/api/webhooks/zenith","secret":"'$ZENITH_WEBHOOK_SECRET'","events":["payment.captured","payment.pending","payment.failed","checkout.succeeded"]}'
   ```

## Probar en local
```bash
npm test                          # pruebas
node tools/dev-server.js --mock   # simula Zenith, sin cobros reales → http://localhost:8080
```
En modo simulado, abre `http://localhost:8080/__mock/pagar?ref=REFERENCIA` para enviar un webhook firmado de prueba y ver la página de gracias.

Para usar la API real en local, crea un archivo `.env` (no se sube al repositorio) y corre `node tools/dev-server.js`.
