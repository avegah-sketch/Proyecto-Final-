import { NextResponse } from "next/server";
import { Producto } from "@/types";
import productos from "../../../../../data/seed.json";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producto = (productos as Producto[]).find((p) => p.id === Number(id));
  if (!producto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(producto);
}
