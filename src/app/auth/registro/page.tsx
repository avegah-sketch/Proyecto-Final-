"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { crearSesion } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { RolUsuario } from "@/types";
import { Store } from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "", confirmPassword: "", rol: "comprador" as RolUsuario });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.password.trim()) { setError("Todos los campos son obligatorios"); return; }
    if (formData.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (formData.password !== formData.confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: formData.nombre, email: formData.email, password: formData.password, rol: formData.rol }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al registrar"); return; }
      crearSesion(data.usuario);
      router.push("/dashboard"); router.refresh();
    } catch { setError("Error de conexión"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Store className="h-10 w-10 text-indigo-600 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Crear Cuenta</h1>
          <p className="text-sm text-gray-500 mt-1">Únete a FashionMarket</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="nombre" label="Nombre completo" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
          <Input id="email" label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input id="password" label="Contraseña" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <Input id="confirmPassword" label="Confirmar contraseña" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de cuenta</label>
            <div className="flex gap-4">
              {(["comprador", "vendedor"] as RolUsuario[]).map((rol) => (
                <label key={rol} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rol" checked={formData.rol === rol} onChange={() => setFormData({ ...formData, rol })} className="accent-indigo-600" />
                  <span className="text-sm text-gray-700 capitalize">{rol}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <Button type="submit" size="lg" className="w-full" isLoading={loading}>Crear Cuenta</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta? <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Inicia sesión</Link>
        </p>
      </Card>
    </div>
  );
}
