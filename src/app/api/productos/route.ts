import { NextResponse } from "next/server";
import { Producto } from "@/types";
import productos from "../../../../data/seed.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");
  const talla = searchParams.get("talla");
  const genero = searchParams.get("genero");
  const precioMin = searchParams.get("precioMin");
  const precioMax = searchParams.get("precioMax");
  const busqueda = searchParams.get("busqueda");

  let result: Producto[] = productos as Producto[];
  if (categoria) result = result.filter((p) => p.categoria === categoria);
  if (talla) result = result.filter((p) => p.talla === talla);
  if (genero) result = result.filter((p) => p.genero === genero);
  if (precioMin) result = result.filter((p) => p.precio >= Number(precioMin));
  if (precioMax) result = result.filter((p) => p.precio <= Number(precioMax));
  if (busqueda) { const q = busqueda.toLowerCase(); result = result.filter((p) => p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)); }

  return NextResponse.json(result);
}
