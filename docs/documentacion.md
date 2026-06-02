# Documentación Completa de FashionMarket

## Marketplace de Ropa Responsivo

---

## 1. Introducción

FashionMarket es una plataforma web responsiva dedicada a la compra y venta de ropa. El proyecto integra una interfaz de usuario moderna con HTML5 semántico, CSS con Tailwind, interactividad en JavaScript/TypeScript con React y Next.js, una base de datos JSON persistente, y una simulación de pasarela de pagos.

### 1.1 Objetivo General

Diseñar y desarrollar un Marketplace web responsivo dedicado a la compra y venta de ropa, que funcione como una plataforma completa desde la maquetación de la interfaz hasta la lógica del backend y el manejo de datos.

### 1.2 Objetivos Específicos

1. **Estructura y Diseño (Frontend)**: Crear una interfaz moderna, atractiva y accesible, garantizando que la plataforma sea completamente adaptable a dispositivos móviles y computadoras.
2. **Interactividad (JavaScript/TypeScript)**: Implementar funciones dinámicas para explorar el catálogo, filtrar prendas por categorías y gestionar un carrito de compras en tiempo real.
3. **Base de Datos**: Diseñar e integrar un sistema de almacenamiento para organizar la información del negocio (inventario, usuarios, transacciones).
4. **Pasarela de Pagos**: Implementar una simulación funcional de pasarela de pagos que valide tarjetas de crédito/débito y procese la orden de compra.

---

## 2. Arquitectura del Sistema

### 2.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────┐
│                  Cliente Web                      │
│  (Navegador - HTML, CSS, JS/TS)                  │
├─────────────────────────────────────────────────┤
│         Next.js (App Router)                      │
│  ┌─────────────┐  ┌─────────────────────────┐    │
│  │  Páginas    │  │  API Routes /app/api/    │    │
│  │  (React)    │  │  (Server-side)           │    │
│  └─────────────┘  └─────────────────────────┘    │
├─────────────────────────────────────────────────┤
│           Capa de Lógica (lib/)                   │
│  ┌──────────┐ ┌───────┐ ┌──────────────────┐    │
│  │  db.ts   │ │auth.ts│ │  cart-context.tsx  │    │
│  └──────────┘ └───────┘ └──────────────────┘    │
├─────────────────────────────────────────────────┤
│          Almacenamiento (JSON File)               │
│              data/db.json                         │
└─────────────────────────────────────────────────┘
```

### 2.2 Componentes Principales

| Componente | Archivo | Descripción |
|---|---|---|
| **Root Layout** | `src/app/layout.tsx` | Layout principal con Navbar, Footer y CartProvider |
| **Navbar** | `src/components/layout/Navbar.tsx` | Navegación responsive con buscador, carrito y menú de usuario |
| **Footer** | `src/components/layout/Footer.tsx` | Footer con enlaces, categorías y contacto |
| **Home Page** | `src/app/page.tsx` | Landing page con hero, beneficios y productos destacados |
| **Catálogo** | `src/app/catalogo/page.tsx` | Productos con filtros en tiempo real |
| **Product Filters** | `src/components/product/ProductFilters.tsx` | Filtros por categoría, talla, género y precio |
| **Product Card** | `src/components/product/ProductCard.tsx` | Tarjeta de producto con imagen, precio y agregar al carrito |
| **Product Detail** | `src/app/producto/[id]/page.tsx` | Detalle completo del producto con selector de cantidad |
| **Carrito** | `src/app/carrito/page.tsx` | Carrito con items, cantidades y resumen |
| **Checkout** | `src/app/checkout/page.tsx` | Formulario multi-paso de envío y pago |
| **Card Form** | `src/components/payment/CardForm.tsx` | Formulario de tarjeta incorporado en checkout |
| **Login** | `src/app/auth/login/page.tsx` | Inicio de sesión |
| **Registro** | `src/app/auth/registro/page.tsx` | Registro de usuario |
| **Dashboard** | `src/app/dashboard/page.tsx` | Perfil de usuario con historial de pedidos |

### 2.3 UI Components Reutilizables

| Componente | Archivo | Props |
|---|---|---|
| **Button** | `src/components/ui/Button.tsx` | variant, size, isLoading, disabled |
| **Input** | `src/components/ui/Input.tsx` | label, error, id |
| **Card** | `src/components/ui/Card.tsx` | className |
| **Badge** | `src/components/ui/Badge.tsx` | variant (default, success, warning, danger, info) |

---

## 3. Base de Datos

### 3.1 Modelo de Datos

```
Usuarios (1) ──< Productos (N)
Usuarios (1) ──< CarritoItems (N)
Usuarios (1) ──< Pedidos (N)
Productos (1) ──< CarritoItems (N)
Productos (1) ──< DetallePedidos (N)
Pedidos (1) ──< DetallePedidos (N)
Pedidos (1) ──< Pago (1)
```

### 3.2 Colecciones

#### Usuarios
| Campo | Tipo | Descripción |
|---|---|---|
| id | number | Identificador único |
| nombre | string | Nombre completo |
| email | string | Email (único) |
| passwordHash | string | Hash de contraseña |
| rol | string | "comprador" o "vendedor" |
| direccion | string? | Dirección |
| telefono | string? | Teléfono |
| fechaRegistro | string | ISO date |

#### Productos
| Campo | Tipo | Descripción |
|---|---|---|
| id | number | Identificador único |
| vendedorId | number | ID del vendedor |
| nombre | string | Nombre del producto |
| descripcion | string | Descripción detallada |
| categoria | string | camisetas, pantalones, vestidos, chaquetas, zapatos, accesorios, deportivo |
| talla | string | XS, S, M, L, XL, XXL |
| genero | string | hombre, mujer, unisex |
| precio | number | Precio en MXN |
| stock | number | Cantidad disponible |
| imagenUrl | string | URL de la imagen |
| fechaPublicacion | string | ISO date |

#### CarritoItems
| Campo | Tipo | Descripción |
|---|---|---|
| id | number | Identificador único |
| usuarioId | number | ID del usuario |
| productoId | number | ID del producto |
| cantidad | number | Cantidad |
| fechaAgregado | string | ISO date |

#### Pedidos
| Campo | Tipo | Descripción |
|---|---|---|
| id | number | Identificador único |
| usuarioId | number | ID del usuario |
| fechaPedido | string | ISO date |
| total | number | Total del pedido |
| estado | string | pendiente, pagado, enviado, entregado, cancelado |
| direccionEnvio | string | Dirección de envío |

#### DetallePedidos
| Campo | Tipo | Descripción |
|---|---|---|
| id | number | Identificador único |
| pedidoId | number | ID del pedido |
| productoId | number | ID del producto |
| cantidad | number | Cantidad |
| precioUnitario | number | Precio en el momento de la compra |

#### Pagos
| Campo | Tipo | Descripción |
|---|---|---|
| id | number | Identificador único |
| pedidoId | number | ID del pedido (único) |
| monto | number | Monto pagado |
| metodoPago | string | Método utilizado |
| estado | string | "aprobado" o "rechazado" |
| transactionId | string | ID de transacción (único) |
| fechaPago | string | ISO date |

### 3.3 Operaciones CRUD (db.ts)

El sistema de base de datos utiliza un archivo JSON (`data/db.json`) con las siguientes operaciones:

- `findMany<T>(coleccion)` - Obtener todos los registros
- `findById<T>(coleccion, id)` - Obtener por ID
- `create<T>(coleccion, item)` - Crear nuevo registro (auto-increment)
- `update<T>(coleccion, id, cambios)` - Actualizar registro
- `delete(coleccion, id)` - Eliminar registro
- `deleteMany(coleccion, ids)` - Eliminar múltiples
- `findWhere<T>(coleccion, predicate)` - Filtrar por condición
- `reset()` - Reiniciar base de datos

---

## 4. Pasarela de Pagos (Simulación Stripe)

### 4.1 Flujo de Pago

```
┌──────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐
│ Usuario  │───>│ Checkout     │───>│ Validación │───>│ API Pago     │
│ (Carrito)│    │ (Formulario) │    │ (Luhn, CVV)│    │ /api/pagos   │
└──────────┘    └──────────────┘    └────────────┘    └──────┬───────┘
                                                             │
                                                    ┌────────v───────┐
                                                    │ Simulación     │
                                                    │ (1.5s delay)   │
                                                    └────────┬───────┘
                                                             │
                                              ┌──────────────v────────┐
                                              │  ¿Aprobado? (95%)    │
                                              └──────┬───────┬───────┘
                                                     │       │
                                              ┌──────v─┐ ┌──v──────┐
                                              │ Éxito  │ │ Rechazo │
                                              │ txn_id │ │ Mensaje │
                                              └────────┘ └─────────┘
```

### 4.2 Validaciones Implementadas

1. **Algoritmo de Luhn**: Verifica que el número de tarjeta sea válido
2. **Formato de tarjeta**: Auto-formatea el número en grupos de 4 dígitos
3. **Fecha de expiración**: Verifica que la tarjeta no esté vencida
4. **CVV**: Valida formato de 3 o 4 dígitos
5. **Titular**: Campo obligatorio
6. **Simulación de procesamiento**: Delay de 1.5s para simular comunicación con el banco
7. **Tasa de aprobación**: 95% de éxito, 5% de rechazo simulado

### 4.3 Respuesta de la API

```typescript
// Éxito
{
  exito: true,
  transactionId: "txn_a1b2c3d4e5f6g7h8i9j0k1l2",
  mensaje: "Pago procesado exitosamente",
  monto: 1048,
  ultimosDigitos: "4242"
}

// Rechazo
{
  exito: false,
  mensaje: "La transacción fue rechazada..."
}
```

---

## 5. Interactividad y Estado

### 5.1 Carrito de Compras (CartContext)

El estado del carrito se maneja con **React Context** y se persiste en **localStorage**.

**Operaciones disponibles:**
- `agregar(producto, cantidad?)` - Añadir producto al carrito
- `eliminar(productoId)` - Eliminar producto del carrito
- `actualizarCantidad(productoId, cantidad)` - Cambiar cantidad
- `vaciar()` - Vaciar todo el carrito
- `itemCount(productoId)` - Obtener cantidad de un producto

**Propiedades de estado:**
- `items` - Array de items con producto y cantidad
- `totalItems` - Número total de items
- `subtotal` - Suma total de precios

### 5.2 Filtros (Catálogo)

Los filtros del catálogo se actualizan en tiempo real usando `useMemo` y `useState`:

- **Categoría**: Radio buttons (camisetas, pantalones, etc.)
- **Género**: Radio buttons (hombre, mujer, unisex)
- **Talla**: Botones toggle (XS - XXL)
- **Precio**: Inputs de rango (min - max)
- **Búsqueda**: Búsqueda por texto (nombre, descripción)

### 5.3 Autenticación

- **Registro**: Crea usuario en la DB y establece sesión en localStorage
- **Login**: Verifica credenciales y establece sesión
- **Sesión**: Almacenada en localStorage con token simulado (expira en 24h)
- **Logout**: Elimina sesión y redirige al inicio
- **Rutas protegidas**: Dashboard verifica sesión, redirige a login si no hay

---

## 6. Diseño Responsivo

### 6.1 Breakpoints

| Breakpoint | Ancho | Target |
|---|---|---|
| sm | 640px | Móviles grandes |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Escritorio |

### 6.2 Adaptaciones por Dispositivo

**Móvil (< 640px):**
- Menú hamburguesa en Navbar
- Productos en 1 columna
- Filtros ocultos (toggle con botón)
- Tabla de resumen apilada

**Tablet (640-1024px):**
- Productos en 2 columnas
- Sidebar de filtros apilable
- Layout de checkout en una columna

**Escritorio (> 1024px):**
- Productos en 3-4 columnas
- Filtros visibles en sidebar fijo
- Checkout en grid de 2 columnas

### 6.3 Paleta de Colores

| Color | CSS | Uso |
|---|---|---|
| Indigo-600 | `#4f46e5` | Botones primarios, enlaces |
| Indigo-700 | `#4338ca` | Hover de botones |
| Gray-50 | `#f9fafb` | Fondo de página |
| Gray-900 | `#111827` | Texto principal |
| Emerald-500 | `#10b981` | Éxito, confirmaciones |
| Red-600 | `#dc2626` | Errores, peligro |

---

## 7. API Endpoints

### 7.1 Productos

#### GET /api/productos
Obtiene productos con filtros opcionales por query params.

**Parámetros:** `categoria`, `talla`, `genero`, `precioMin`, `precioMax`, `busqueda`

**Respuesta:** `Producto[]`

#### GET /api/productos/[id]
Obtiene un producto por su ID.

**Respuesta:** `Producto | { error: string }`

### 7.2 Autenticación

#### POST /api/auth/registro
**Body:** `{ nombre, email, password, rol? }`

**Respuesta:** `{ usuario } | { error: string }`

#### POST /api/auth/login
**Body:** `{ email, password }`

**Respuesta:** `{ usuario, token } | { error: string }`

### 7.3 Carrito

#### GET /api/carrito?usuarioId=N
Obtiene items del carrito con datos del producto.

#### POST /api/carrito
**Body:** `{ usuarioId, productoId, cantidad? }`

#### DELETE /api/carrito/[id]
Elimina un item del carrito.

### 7.4 Pedidos

#### GET /api/pedidos?usuarioId=N
Obtiene pedidos del usuario con detalles y pago.

#### POST /api/pedidos
**Body:** `{ usuarioId, direccionEnvio, items: [{ productoId, cantidad }] }`

### 7.5 Pagos

#### POST /api/pagos/procesar
**Body:** `{ monto, tarjeta: { numero, titular, mesExpiracion, anioExpiracion, cvv } }`

**Respuesta:** `{ exito, transactionId?, mensaje }`

---

## 8. Categorías de Productos

| Categoría | Descripción |
|---|---|
| `camisetas` | Camisetas, polos, blusas |
| `pantalones` | Jeans, joggers, formales |
| `vestidos` | Vestidos casuales, elegantes, de verano |
| `chaquetas` | Chaquetas de cuero, mezclilla, deportivas |
| `zapatos` | Zapatillas, tacones, casuales |
| `accesorios` | Gorras, bufandas, bolsos |
| `deportivo` | Ropa deportiva, leggings, conjuntos |

---

## 9. Algoritmo de Luhn

El algoritmo de Luhn se utiliza para validar números de tarjetas de crédito/débito:

```typescript
function luhnCheck(numero: string): boolean {
  const digitos = numero.replace(/\D/g, "");
  if (digitos.length < 13 || digitos.length > 19) return false;

  let suma = 0;
  let alternar = false;

  for (let i = digitos.length - 1; i >= 0; i--) {
    let digito = parseInt(digitos[i], 10);
    if (alternar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
    alternar = !alternar;
  }

  return suma % 10 === 0;
}
```

**Tarjetas de prueba válidas:**
- `4242 4242 4242 4242` (Visa)
- `5555 5555 5555 4444` (Mastercard)
- `3782 822463 10005` (Amex)

---

## 10. Guía de Usuario

### 10.1 Navegación General

1. **Inicio**: Landing page con productos destacados y beneficios
2. **Catálogo**: Explorar todos los productos con filtros
3. **Producto**: Click en cualquier producto para ver detalle
4. **Carrito**: Revisar items y proceder al pago
5. **Checkout**: Ingresar información de envío y pago

### 10.2 Flujo de Compra

```
Inicio → Catálogo → Filtrar productos → Click en producto
→ Agregar al carrito → Ir al carrito
→ Checkout → Información de envío → Datos de pago
→ Confirmación → ¡Compra exitosa!
```

### 10.3 Tips

- Usa el buscador en la barra de navegación para encontrar productos rápidamente
- Los filtros del catálogo se actualizan en tiempo real
- El carrito persiste aunque cierres el navegador (localStorage)
- Para probar pagos, usa: `4242 4242 4242 4242` | Mes: `12` | Año: `27` | CVV: `123`

---

## 11. Despliegue

### 11.1 Producción

```bash
# Build de producción
npm run build

# Iniciar servidor
npm start
```

### 11.2 Variables de Entorno

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

*Documentación generada el 01/06/2026*
*Proyecto Final - Universidad*
