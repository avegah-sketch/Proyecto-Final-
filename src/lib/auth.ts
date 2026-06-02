import { Usuario } from "@/types";

const SESSION_KEY = "marketplace_session";

export interface Sesion {
  usuario: Usuario;
  token: string;
}

export function crearSesion(usuario: Usuario): Sesion {
  const token = btoa(JSON.stringify({ id: usuario.id, email: usuario.email, exp: Date.now() + 86400000 }));
  const sesion: Sesion = { usuario, token };
  if (typeof window !== "undefined") localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
  return sesion;
}

export function obtenerSesion(): Sesion | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const sesion: Sesion = JSON.parse(raw);
    const payload = JSON.parse(atob(sesion.token));
    if (payload.exp < Date.now()) { cerrarSesion(); return null; }
    return sesion;
  } catch { return null; }
}

export function cerrarSesion(): void {
  if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
}

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "hash_" + Math.abs(hash).toString(16);
}

export function verificarPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
