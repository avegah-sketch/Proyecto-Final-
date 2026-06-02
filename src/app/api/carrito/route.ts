import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CarritoItem } from "@/types";

export async function GET(request: Request) {
  const usuarioId = Number(new URL(request.url).searchParams.get("usuarioId"));
  if (!usuarioId) return NextResponse.json({ error: "usuarioId requerido" }, { status: 400 });
  const items: CarritoItem[] = db.findWhere("carritoItems", (i: CarritoItem) => i.usuarioId === usuarioId);
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const { usuarioId, productoId, cantidad } = await request.json();
    if (!usuarioId || !productoId) return NextResponse.json({ error: "usuarioId y productoId requeridos" }, { status: 400 });
    const existente = db.findWhere("carritoItems", (i: CarritoItem) => i.usuarioId === usuarioId && i.productoId === productoId).pop();
    if (existente) {
      const actualizado = db.update<CarritoItem>("carritoItems", existente.id, { cantidad: existente.cantidad + (cantidad || 1) as any });
      return NextResponse.json(actualizado);
    }
    const nuevo = db.create<CarritoItem>("carritoItems", { usuarioId, productoId, cantidad: cantidad || 1, fechaAgregado: new Date().toISOString() });
    return NextResponse.json(nuevo, { status: 201 });
  } catch { return NextResponse.json({ error: "Error" }, { status: 500 }); }
}
