export type CategoriaProducto =
  | "camisetas" | "pantalones" | "vestidos" | "chaquetas"
  | "zapatos" | "accesorios" | "ropa_interior" | "deportivo";

export type Talla = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type Genero = "hombre" | "mujer" | "unisex";

export interface Producto {
  id: number;
  vendedorId: number;
  nombre: string;
  descripcion: string;
  categoria: CategoriaProducto;
  talla: Talla;
  genero: Genero;
  precio: number;
  stock: number;
  imagenUrl: string;
  fechaPublicacion: string;
}

export interface FiltrosProducto {
  categoria?: CategoriaProducto;
  talla?: Talla;
  genero?: Genero;
  precioMin?: number;
  precioMax?: number;
  busqueda?: string;
}
