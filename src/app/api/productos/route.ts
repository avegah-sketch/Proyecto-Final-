import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Producto } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");
  const talla = searchParams.get("talla");
  const genero = searchParams.get("genero");
  const precioMin = searchParams.get("precioMin");
  const precioMax = searchParams.get("precioMax");
  const busqueda = searchParams.get("busqueda");

  let productos: Producto[] = db.findMany("productos");

  if (categoria) productos = productos.filter((p) => p.categoria === categoria);
  if (talla) productos = productos.filter((p) => p.talla === talla);
  if (genero) productos = productos.filter((p) => p.genero === genero);
  if (precioMin) productos = productos.filter((p) => p.precio >= Number(precioMin));
  if (precioMax) productos = productos.filter((p) => p.precio <= Number(precioMax));
  if (busqueda) {
    const q = busqueda.toLowerCase();
    productos = productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
    );
  }

  return NextResponse.json(productos);
}
