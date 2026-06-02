import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CarritoItem } from "@/types";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eliminado = db.delete("carritoItems", Number(id));

  if (!eliminado) {
    return NextResponse.json({ error: "Item no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ message: "Item eliminado" });
}
