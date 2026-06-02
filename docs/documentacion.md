# Documentación Completa de FashionMarket

## Marketplace de Ropa Responsivo

---

## 1. Introducción

FashionMarket es una plataforma web responsiva dedicada a la compra y venta de ropa. El proyecto integra una interfaz de usuario moderna con Next.js, TypeScript y Tailwind CSS, una base de datos JSON persistente, y una simulación de pasarela de pagos.

### Objetivo General

Diseñar y desarrollar un Marketplace web responsivo dedicado a la compra y venta de ropa, que funcione como una plataforma completa desde la maquetación de la interfaz hasta la lógica del backend y el manejo de datos.

### Objetivos Específicos

1. **Estructura y Diseño (Frontend)**: Interfaz moderna, atractiva y accesible, adaptable a dispositivos móviles y computadoras.
2. **Interactividad (JavaScript/TypeScript)**: Explorar catálogo, filtrar prendas, gestionar carrito en tiempo real.
3. **Base de Datos**: Almacenar y organizar información del negocio (inventario, usuarios, transacciones).
4. **Pasarela de Pagos**: Simulación funcional que valide tarjetas y procese la orden de compra.

---

## 2. Arquitectura

```
Cliente (Navegador)
    ↕
Next.js App Router
    ↕
API Routes (/app/api/)
    ↕
JSON File DB (data/db.json)
```

### Stack Tecnológico

| Tecnología | Versión |
|---|---|
| Next.js (App Router) | 15.5 |
| React | 19.1 |
| TypeScript | 5.8 |
| Tailwind CSS | 4.1 |
| Lucide React | 0.511 |

---

## 3. Base de Datos

### Colecciones

**Usuarios**: id, nombre, email, passwordHash, rol, direccion, telefono, fechaRegistro

**Productos**: id, vendedorId, nombre, descripcion, categoria, talla, genero, precio, stock, imagenUrl, fechaPublicacion

**CarritoItems**: id, usuarioId, productoId, cantidad, fechaAgregado

**Pedidos**: id, usuarioId, fechaPedido, total, estado, direccionEnvio

**DetallePedidos**: id, pedidoId, productoId, cantidad, precioUnitario

**Pagos**: id, pedidoId, monto, metodoPago, estado, transactionId, fechaPago

### Operaciones CRUD (db.ts)

- findMany<T>(coleccion) - Obtener todos
- findById<T>(coleccion, id) - Obtener por ID
- create<T>(coleccion, item) - Crear (auto-increment)
- update<T>(coleccion, id, cambios) - Actualizar
- delete(coleccion, id) - Eliminar
- deleteMany(coleccion, ids) - Eliminar múltiples
- findWhere<T>(coleccion, predicate) - Filtrar
- reset() - Reiniciar

---

## 4. Pasarela de Pagos (Simulación Stripe)

### Flujo

1. Usuario completa formulario de tarjeta
2. Validación en cliente (Luhn, formato, fecha, CVV)
3. POST a /api/pagos/procesar
4. Servidor valúa nuevamente
5. Simulación de procesamiento (1.5s delay)
6. 95% de tasa de éxito
7. Respuesta con transactionId o mensaje de error

### Validaciones

- **Luhn**: Verifica que el número de tarjeta sea matemáticamente válido
- **Fecha**: Comprueba que la tarjeta no esté vencida
- **CVV**: Formato de 3 o 4 dígitos
- **Campos**: Todos los campos son requeridos

### Algoritmo de Luhn

```typescript
function luhnCheck(numero: string): boolean {
  const digitos = numero.replace(/\D/g, "");
  if (digitos.length < 13 || digitos.length > 19) return false;
  let suma = 0, alternar = false;
  for (let i = digitos.length - 1; i >= 0; i--) {
    let digito = parseInt(digitos[i], 10);
    if (alternar) { digito *= 2; if (digito > 9) digito -= 9; }
    suma += digito; alternar = !alternar;
  }
  return suma % 10 === 0;
}
```

---

## 5. Interactividad

### Carrito (CartContext)

- Context API + localStorage
- Operaciones: agregar, eliminar, actualizarCantidad, vaciar, itemCount
- Propiedades: items, totalItems, subtotal

### Filtros (Catálogo)

- Categoría, género, talla, precio, búsqueda
- Actualización en tiempo real con useMemo

### Autenticación

- Sesión en localStorage con token simulado (24h)
- Rutas protegidas: Dashboard redirige a login

---

## 6. Diseño Responsivo

### Breakpoints

| Breakpoint | Target |
|---|---|
| sm (640px) | Móviles grandes |
| md (768px) | Tablets |
| lg (1024px) | Laptops |
| xl (1280px) | Escritorio |

### Adaptaciones

- **Móvil**: Menú hamburguesa, 1 columna, filtros ocultos
- **Tablet**: 2 columnas, layout apilable
- **Escritorio**: 3-4 columnas, sidebar de filtros, checkout en grid

### Paleta

| Color | Uso |
|---|---|
| Indigo-600 (#4f46e5) | Botones, enlaces |
| Emerald-500 (#10b981) | Éxito |
| Red-600 (#dc2626) | Errores |
| Gray-50 (#f9fafb) | Fondo |

---

## 7. API Endpoints

### GET /api/productos
Parámetros: categoria, talla, genero, precioMin, precioMax, busqueda
Respuesta: Producto[]

### GET /api/productos/[id]
Respuesta: Producto | { error }

### POST /api/auth/registro
Body: { nombre, email, password, rol }
Respuesta: { usuario } | { error }

### POST /api/auth/login
Body: { email, password }
Respuesta: { usuario, token } | { error }

### GET /api/carrito?usuarioId=N
Respuesta: CarritoItem[]

### POST /api/carrito
Body: { usuarioId, productoId, cantidad }
Respuesta: CarritoItem

### DELETE /api/carrito/[id]
Respuesta: { message }

### GET /api/pedidos?usuarioId=N
Respuesta: Pedido[] (con detalles y pago)

### POST /api/pedidos
Body: { usuarioId, direccionEnvio, items: [{productoId, cantidad}] }
Respuesta: Pedido

### POST /api/pagos/procesar
Body: { monto, tarjeta: {numero, titular, mesExpiracion, anioExpiracion, cvv} }
Respuesta: { exito, transactionId?, mensaje }

---

## 8. Categorías de Productos

| Categoría | Descripción |
|---|---|
| camisetas | Camisetas, polos, blusas |
| pantalones | Jeans, joggers, formales |
| vestidos | Casuales, elegantes, verano |
| chaquetas | Cuero, mezclilla, deportivas |
| zapatos | Zapatillas, tacones, casuales |
| accesorios | Gorras, bufandas, bolsos |
| deportivo | Ropa deportiva, leggings |

---

## 9. Flujo de Compra

```
Inicio → Catálogo → Filtrar → Producto → Agregar al carrito
→ Carrito → Checkout → Envío → Pago → Confirmación
```

---

## 10. Despliegue

```bash
npm run build   # Build producción
npm start       # Iniciar servidor
```

Variables de entorno: ninguna requerida (configuración por defecto)

---

*Documentación generada el 01/06/2026 - Proyecto Final*
