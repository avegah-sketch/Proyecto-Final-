import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CarritoItem, CarritoItemConProducto, Producto } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuarioId = Number(searchParams.get("usuarioId"));

  if (!usuarioId) {
    return NextResponse.json({ error: "usuarioId requerido" }, { status: 400 });
  }

  const items: CarritoItem[] = db.findWhere("carritoItems", (i: CarritoItem) => i.usuarioId === usuarioId);
  const productos: Producto[] = db.findMany("productos");

  const itemsConProducto: CarritoItemConProducto[] = items.map((item) => ({
    ...item,
    producto: productos.find((p) => p.id === item.productoId)!,
  })).filter((item) => item.producto);

  return NextResponse.json(itemsConProducto);
}

export async function POST(request: Request) {
  try {
    const { usuarioId, productoId, cantidad } = await request.json();

    if (!usuarioId || !productoId) {
      return NextResponse.json({ error: "usuarioId y productoId requeridos" }, { status: 400 });
    }

    const existente: CarritoItem | undefined = db
      .findWhere("carritoItems", (i: CarritoItem) => i.usuarioId === usuarioId && i.productoId === productoId)
      .pop();

    if (existente) {
      const actualizado = db.update<CarritoItem>("carritoItems", existente.id, {
        cantidad: existente.cantidad + (cantidad || 1),
      });
      return NextResponse.json(actualizado);
    }

    const nuevo = db.create<CarritoItem>("carritoItems", {
      usuarioId,
      productoId,
      cantidad: cantidad || 1,
      fechaAgregado: new Date().toISOString(),
    });

    return NextResponse.json(nuevo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al agregar al carrito" }, { status: 500 });
  }
}
