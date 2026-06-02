import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eliminado = db.delete("carritoItems", Number(id));
  if (!eliminado) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ message: "Eliminado" });
}
