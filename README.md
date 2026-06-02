# FashionMarket - Marketplace de Ropa

Plataforma web responsiva para la compra y venta de ropa.

## Stack Tecnológico

**Next.js** (App Router) + **TypeScript** + **Tailwind CSS v4** + **Lucide React** + **JSON DB**

## Instalación

```bash
git clone https://github.com/avegah-sketch/Proyecto-Final-.git
cd Proyecto-Final-
npm install
npm run dev
# Abrir http://localhost:3000
```

## Credenciales de Prueba

| Rol | Email | Contraseña |
|---|---|---|
| Comprador | comprador@marketplace.com | demo123 |
| Vendedor | vendedor@marketplace.com | demo123 |

## Tarjeta de Prueba

| Campo | Valor |
|---|---|
| Número | 4242 4242 4242 4242 |
| Mes | 12 |
| Año | 27 |
| CVV | 123 |

## Estructura

```
src/
├── app/                    # Páginas + API Routes
│   ├── page.tsx            # Landing Page
│   ├── catalogo/           # Catálogo con filtros
│   ├── producto/[id]/      # Detalle de producto
│   ├── carrito/            # Carrito de compras
│   ├── checkout/           # Checkout + Pago
│   ├── auth/               # Login / Registro
│   ├── dashboard/          # Perfil de usuario
│   └── api/                # Backend interno
├── components/             # Componentes UI
│   ├── ui/                 # Button, Input, Card, Badge
│   ├── layout/             # Navbar, Footer
│   └── product/            # ProductCard, ProductGrid, Filters
├── lib/                    # Lógica (db, auth, cart, utils)
└── types/                  # Tipos TypeScript
```

## Funcionalidades

- **Catálogo**: Filtros en tiempo real (categoría, talla, género, precio, búsqueda)
- **Carrito**: Context API + localStorage, persistente entre sesiones
- **Auth**: Login/Registro con sesión local y dashboard de usuario
- **Checkout**: Formulario multi-paso (envío → pago → confirmación)
- **Pago**: Simulación Stripe con validación Luhn, procesamiento asíncrono
- **API**: 8 endpoints REST (productos, auth, carrito, pedidos, pagos)
- **DB**: Archivo JSON persistente con 25 productos seed

## API Endpoints

| Endpoint | Método | Descripción |
|---|---|---|
| /api/productos | GET | Productos con filtros |
| /api/productos/[id] | GET | Detalle de producto |
| /api/auth/registro | POST | Registrar usuario |
| /api/auth/login | POST | Iniciar sesión |
| /api/carrito | GET/POST | Obtener/agregar items |
| /api/carrito/[id] | DELETE | Eliminar item |
| /api/pedidos | GET/POST | Historial/crear pedido |
| /api/pagos/procesar | POST | Procesar pago simulado |

## Documentación

Documentación completa en [docs/documentacion.md](./docs/documentacion.md)
