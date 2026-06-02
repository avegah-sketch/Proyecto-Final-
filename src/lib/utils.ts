import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrecio(precio: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(precio);
}

export function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function generarTransactionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let r = "txn_";
  for (let i = 0; i < 24; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
  return r;
}

export function luhnCheck(numero: string): boolean {
  const digitos = numero.replace(/\D/g, "");
  if (digitos.length < 13 || digitos.length > 19) return false;
  let suma = 0, alternar = false;
  for (let i = digitos.length - 1; i >= 0; i--) {
    let digito = parseInt(digitos[i], 10);
    if (alternar) { digito *= 2; if (digito > 9) digito -= 9; }
    suma += digito; alternar = !alternar;
  }
  return suma % 10 === 0;
}

export function enmascararTarjeta(numero: string): string {
  const clean = numero.replace(/\D/g, "");
  return clean.length < 4 ? clean : `**** **** **** ${clean.slice(-4)}`;
}
