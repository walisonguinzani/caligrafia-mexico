// Validación de datos del comprador antes de llamar a Zenith.
// Zenith rechaza nombres o correos de prueba (422), así que filtramos aquí
// para dar un mensaje claro en español.

const NAME_PART = /^[\p{L}][\p{L}'’.-]*$/u;
const DISPOSABLE = new Set([
  'example.com', 'example.org', 'test.com', 'prueba.com', 'mailinator.com', 'guerrillamail.com',
  'yopmail.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org', 'trashmail.com', 'sharklasers.com',
]);

/** @param {unknown} v */
export function cleanName(v) {
  return typeof v === 'string' ? v.normalize('NFC').replace(/\s+/g, ' ').trim() : '';
}

/** @param {unknown} v */
export function cleanEmail(v) {
  return typeof v === 'string' ? v.trim().toLowerCase() : '';
}

/**
 * @param {string} name
 * @returns {string|null} mensaje de error o null
 */
export function nameError(name) {
  if (!name) return 'Escribe tu nombre y apellido.';
  if (name.length > 120) return 'El nombre es demasiado largo.';
  const parts = name.split(' ');
  if (parts.length < 2) return 'Escribe tu nombre y al menos un apellido.';
  if (parts.some((p) => !NAME_PART.test(p))) return 'El nombre solo puede tener letras.';
  if (parts.filter((p) => p.replace(/[^\p{L}]/gu, '').length >= 2).length < 2) return 'Escribe tu nombre y apellido completos, sin iniciales.';
  if (parts.some((p) => /(.)\1{2,}/iu.test(p))) return 'Revisa tu nombre: parece tener letras repetidas.';
  return null;
}

/**
 * @param {string} email
 * @returns {string|null}
 */
export function emailError(email) {
  if (!email) return 'Escribe tu correo electrónico.';
  if (email.length > 160 || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return 'Revisa tu correo: parece incompleto.';
  const domain = email.split('@')[1];
  if (DISPOSABLE.has(domain) || /^(test|prueba|ejemplo|example)@/.test(email)) return 'Usa tu correo real: ahí te enviamos tu acceso.';
  return null;
}

/** @param {unknown} v */
export function isUuid(v) {
  return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}
