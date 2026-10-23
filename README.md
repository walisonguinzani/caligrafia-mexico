# Caligrafía desde Cero · Landing page

Landing page en español (México) del **Paquete Completo de Caligrafía** ($200 MXN, garantía de 30 días).

- `index.html`: la página completa (HTML, CSS y JS en un solo archivo).
- `assets/`: fuentes, fotos, video de la aplicación y páginas de muestra de los cuadernillos.
- `bonos/`: los 5 bonos en PDF.

## Checkout
Pega la URL del checkout en `CHECKOUT_URL`, al final de `index.html`. Los parámetros `utm_*` y `fbclid` de la visita se envían automáticamente al checkout.

## Ver en local
```
python3 -m http.server 8080
```
y abre http://localhost:8080

## Publicar
Es un sitio estático: se puede subir tal cual a Vercel, Netlify o cualquier hosting.
