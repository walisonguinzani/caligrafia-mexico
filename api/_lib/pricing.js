// Catálogo de la oferta. Los precios viven SOLO en el servidor: el navegador
// envía qué order bumps eligió, nunca montos.
// Montos en centavos de peso mexicano (unidad minoritaria).

export const CURRENCY = 'MXN';
export const COUNTRY = 'MX';

export const PRODUCT = {
  id: 'paquete-caligrafia',
  name: 'Paquete Completo de Caligrafía',
  amount: 20000, // $200.00 MXN
};

export const BUMPS = {
  'acceso-de-por-vida': {
    id: 'acceso-de-por-vida',
    name: 'Acceso de por vida',
    amount: 5000, // $50.00 MXN
  },
  'grupo-vip': {
    id: 'grupo-vip',
    name: 'Grupo VIP de WhatsApp',
    amount: 5000, // $50.00 MXN
  },
};

/**
 * Calcula el pedido a partir de los bumps elegidos.
 * Ignora ids desconocidos y duplicados.
 * @param {unknown} bumpIds
 * @returns {{ items: {id:string,name:string,amount:number}[], bumps: string[], amount: number }}
 */
export function priceOrder(bumpIds) {
  const list = Array.isArray(bumpIds) ? bumpIds : [];
  const chosen = [...new Set(list.filter((id) => typeof id === 'string' && Object.hasOwn(BUMPS, id)))].sort();
  const items = [{ id: PRODUCT.id, name: PRODUCT.name, amount: PRODUCT.amount }, ...chosen.map((id) => ({ ...BUMPS[id] }))];
  const amount = items.reduce((sum, it) => sum + it.amount, 0);
  return { items, bumps: chosen, amount };
}
