# FashionMarket - Marketplace de Ropa

Plataforma web responsiva para la compra y venta de ropa, desarrollada con **Next.js**, **TypeScript**, **Tailwind CSS v4** y **Prisma + SQLite**.

---

## 🚀 Stack Tecnológico

| Tecnología | Versión |
|---|---|
| **Next.js** (App Router) | 15.3 |
| **React** | 19.1 |
| **TypeScript** | 5.8 |
| **Tailwind CSS** | 4.1 |
| **Prisma + SQLite** | 7.8 |

## 📁 Estructura del Proyecto

```
marketplace-ropa/
├── prisma/
│   └── schema.prisma        # Modelos de datos
├── src/
│   ├── app/                 # App Router (páginas + API)
│   │   ├── page.tsx         # Landing Page
│   │   ├── catalogo/        # Catálogo con filtros
│   │   ├── producto/[id]/   # Detalle de producto
│   │   ├── carrito/         # Carrito de compras
│   │   ├── checkout/        # Checkout + Pago
│   │   ├── auth/            # Login / Registro
│   │   ├── dashboard/       # Perfil de usuario
│   │   └── api/             # API Routes (backend)
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/              # Button, Input, Card, Badge
│   │   ├── layout/          # Navbar, Footer
│   │   ├── product/         # ProductCard, ProductGrid, Filters
│   │   ├── cart/            # Componentes del carrito
│   │   └── payment/         # Formularios de pago
│   ├── lib/                 # Lógica de negocio
│   │   ├── db.ts            # Base de datos JSON
│   │   ├── auth.ts          # Autenticación
│   │   ├── cart-context.tsx  # Estado global del carrito
│   │   ├── utils.ts         # Utilidades (formato, validación)
│   │   └── seed.ts          # Datos de ejemplo
│   └── types/
│       └── index.ts         # Tipos TypeScript
├── docs/
│   └── documentacion.md     # Documentación completa
└── data/
    └── db.json              # Base de datos (archivo JSON)
```

## ⚙️ Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/avegah-sketch/Proyecto-Final-.git
cd Proyecto-Final-

# 2. Instalar dependencias
npm install

# 3. Inicializar la base de datos y seed
npm run db:push
npm run db:seed

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir navegador en http://localhost:3000
```

## 🧪 Credenciales de Prueba

| Rol | Email | Contraseña |
|---|---|---|
| Comprador | `comprador@marketplace.com` | `demo123` |
| Vendedor | `vendedor@marketplace.com` | `demo123` |

## 💳 Tarjeta de Prueba (Pago)

| Campo | Valor |
|---|---|
| Número | `4242 4242 4242 4242` |
| Titular | Cualquier nombre |
| Mes | `12` |
| Año | `27` (o año futuro) |
| CVV | `123` |

## 📋 Funcionalidades

### Frontend
- **Landing Page** con hero section y productos destacados
- **Catálogo** con filtros en tiempo real (categoría, talla, género, precio, búsqueda)
- **Detalle de producto** con selector de cantidad y productos relacionados
- **Carrito de compras** persistente (localStorage) con resumen y envío
- **Checkout** multi-paso (información de envío → pago → confirmación)
- **Autenticación** (login/registro) con sesión local
- **Dashboard** con historial de pedidos
- **Diseño responsive** (móvil, tablet, escritorio)

### Backend (API Routes)
| Endpoint | Método | Descripción |
|---|---|---|
| `/api/productos` | GET | Productos con filtros |
| `/api/productos/[id]` | GET | Detalle de producto |
| `/api/auth/registro` | POST | Registrar usuario |
| `/api/auth/login` | POST | Iniciar sesión |
| `/api/carrito` | GET/POST | Obtener/agregar items |
| `/api/carrito/[id]` | DELETE | Eliminar item |
| `/api/pedidos` | GET/POST | Historial/crear pedido |
| `/api/pagos/procesar` | POST | Procesar pago simulado |

### Pasarela de Pago (Simulación Stripe)
- Validación de tarjeta con algoritmo de **Luhn**
- Verificación de fecha de expiración
- Validación de CVV
- Procesamiento asíncrono con `fetch`
- Generación de ID de transacción
- Simulación de aprobación/rechazo (95% éxito)
- Estados: loading → éxito → confirmación

### Base de Datos
- Archivo JSON como almacenamiento persistente
- 6 colecciones: usuarios, productos, carritoItems, pedidos, detallePedidos, pagos
- Seed con 25 productos de ropa de ejemplo
- Operaciones CRUD completas

## 🛠️ Comandos Útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run db:push      # Inicializar DB
npm run db:seed      # Poblar con datos de ejemplo
npm run db:studio    # Interfaz de base de datos
```

## 📄 Licencia

Proyecto académico - Universidad.

---

*Documentación completa disponible en [docs/documentacion.md](./docs/documentacion.md)*
