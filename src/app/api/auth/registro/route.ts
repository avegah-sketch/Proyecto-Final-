import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Usuario } from "@/types";

export async function POST(request: Request) {
  try {
    const { nombre, email, password, rol } = await request.json();
    if (!nombre || !email || !password) return NextResponse.json({ error: "Campos obligatorios" }, { status: 400 });
    const usuarios: Usuario[] = db.findMany("usuarios");
    if (usuarios.some((u) => u.email === email)) return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });
    const usuario = db.create<Usuario>("usuarios", { nombre, email, passwordHash: hashPassword(password), rol: rol || "comprador", fechaRegistro: new Date().toISOString() });
    const { passwordHash: _, ...usuarioSinPass } = usuario;
    return NextResponse.json({ usuario: usuarioSinPass }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
