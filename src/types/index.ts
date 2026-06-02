export type RolUsuario = "comprador" | "vendedor";

export type CategoriaProducto =
  | "camisetas" | "pantalones" | "vestidos" | "chaquetas"
  | "zapatos" | "accesorios" | "ropa_interior" | "deportivo";

export type Talla = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type Genero = "hombre" | "mujer" | "unisex";
export type EstadoPedido = "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado";

export interface Usuario {
  id: number; nombre: string; email: string; passwordHash: string;
  rol: RolUsuario; direccion?: string; telefono?: string; fechaRegistro: string;
}

export interface Producto {
  id: number; vendedorId: number; nombre: string; descripcion: string;
  categoria: CategoriaProducto; talla: Talla; genero: Genero;
  precio: number; stock: number; imagenUrl: string; fechaPublicacion: string;
}

export interface CarritoItem {
  id: number; usuarioId: number; productoId: number; cantidad: number; fechaAgregado: string;
}

export interface CarritoItemConProducto extends CarritoItem { producto: Producto; }

export interface Pedido {
  id: number; usuarioId: number; fechaPedido: string; total: number;
  estado: EstadoPedido; direccionEnvio: string; detalles?: DetallePedido[]; pago?: Pago;
}

export interface DetallePedido {
  id: number; pedidoId: number; productoId: number; cantidad: number;
  precioUnitario: number; producto?: Producto;
}

export interface Pago {
  id: number; pedidoId: number; monto: number; metodoPago: string;
  estado: "aprobado" | "rechazado"; transactionId: string; fechaPago: string;
}

export interface FiltrosProducto {
  categoria?: CategoriaProducto; talla?: Talla; genero?: Genero;
  precioMin?: number; precioMax?: number; busqueda?: string;
}

export interface TarjetaPago {
  cardNumber: string; cardHolder: string; expiryMonth: string; expiryYear: string; cvv: string;
}

export interface ResultadoPago {
  exito: boolean; transactionId?: string; mensaje: string;
}
