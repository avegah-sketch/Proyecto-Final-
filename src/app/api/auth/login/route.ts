import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Usuario } from "@/types";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const usuarios: Usuario[] = db.findMany("usuarios");
    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario || usuario.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const { passwordHash: _, ...usuarioSinPass } = usuario;
    return NextResponse.json({ usuario: usuarioSinPass, token: "token_simulado_" + Date.now() });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
