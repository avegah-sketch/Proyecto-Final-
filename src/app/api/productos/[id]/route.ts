import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Producto } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const producto: Producto | null = db.findById("productos", Number(id));

  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(producto);
}
