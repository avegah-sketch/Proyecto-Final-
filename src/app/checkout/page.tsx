"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrecio, luhnCheck, generarTransactionId } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { TarjetaPago, ResultadoPago } from "@/types";
import { CreditCard, Lock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

type Paso = "informacion" | "pago" | "confirmacion";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, vaciar } = useCart();
  const [paso, setPaso] = useState<Paso>("informacion");
  const envio = subtotal >= 999 ? 0 : 99;
  const total = subtotal + envio;

  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "", direccion: "", ciudad: "", codigoPostal: "" });
  const [tarjeta, setTarjeta] = useState<TarjetaPago>({ cardNumber: "", cardHolder: "", expiryMonth: "", expiryYear: "", cvv: "" });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoPago | null>(null);

  if (items.length === 0 && paso !== "confirmacion") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">No hay productos</h1>
        <Link href="/catalogo"><Button className="mt-4">Ir al catálogo</Button></Link>
      </div>
    );
  }

  const validarInformacion = () => {
    const errs: Record<string, string> = {};
    if (!formData.nombre.trim()) errs.nombre = "Requerido";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Email inválido";
    if (!formData.direccion.trim()) errs.direccion = "Requerido";
    if (!formData.ciudad.trim()) errs.ciudad = "Requerido";
    if (!formData.codigoPostal.trim()) errs.codigoPostal = "Requerido";
    setErrores(errs); return Object.keys(errs).length === 0;
  };

  const validarTarjeta = () => {
    const errs: Record<string, string> = {};
    const clean = tarjeta.cardNumber.replace(/\s/g, "");
    if (!luhnCheck(clean)) errs.cardNumber = "Número de tarjeta inválido";
    if (!tarjeta.cardHolder.trim()) errs.cardHolder = "Requerido";
    if (!/^\d{2}$/.test(tarjeta.expiryMonth) || parseInt(tarjeta.expiryMonth) < 1 || parseInt(tarjeta.expiryMonth) > 12) errs.expiryMonth = "Mes inválido (01-12)";
    if (!/^\d{2,4}$/.test(tarjeta.expiryYear)) errs.expiryYear = "Año inválido";
    if (!/^\d{3,4}$/.test(tarjeta.cvv)) errs.cvv = "CVV inválido";
    setErrores(errs); return Object.keys(errs).length === 0;
  };

  const handlePago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarTarjeta()) return;
    setProcesando(true);
    try {
      const res = await fetch("/api/pagos/procesar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monto: total, tarjeta: { numero: tarjeta.cardNumber.replace(/\s/g, ""), titular: tarjeta.cardHolder, mesExpiracion: tarjeta.expiryMonth, anioExpiracion: tarjeta.expiryYear, cvv: tarjeta.cvv } }),
      });
      const data = await res.json();
      setResultado(data);
      if (data.exito) { setPaso("confirmacion"); vaciar(); }
    } catch { setResultado({ exito: false, mensaje: "Error de conexión" }); }
    finally { setProcesando(false); }
  };

  const formatearTarjeta = (value: string) => value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="flex items-center gap-4 mb-8">
        {["informacion", "pago", "confirmacion"].map((p, i) => (
          <div key={p} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${paso === p ? "bg-indigo-600 text-white" : i <= ["informacion", "pago"].indexOf(paso) ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
              {i < ["informacion", "pago"].indexOf(paso) ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${paso === p ? "font-semibold text-gray-900" : "text-gray-500"}`}>
              {p === "informacion" ? "Envío" : p === "pago" ? "Pago" : "Confirmación"}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {paso === "informacion" && (
            <Card className="p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Información de Envío</h2>
              <form onSubmit={(e) => { e.preventDefault(); if (validarInformacion()) setPaso("pago"); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="nombre" label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} error={errores.nombre} />
                  <Input id="email" label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errores.email} />
                </div>
                <Input id="telefono" label="Teléfono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                <Input id="direccion" label="Dirección" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} error={errores.direccion} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="ciudad" label="Ciudad" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} error={errores.ciudad} />
                  <Input id="codigoPostal" label="Código Postal" value={formData.codigoPostal} onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })} error={errores.codigoPostal} />
                </div>
                <Button type="submit" size="lg" className="w-full">Continuar al Pago</Button>
              </form>
            </Card>
          )}
          {paso === "pago" && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4"><CreditCard className="h-5 w-5 text-indigo-600" /><h2 className="font-semibold text-lg text-gray-900">Pago con Tarjeta</h2></div>
              <p className="text-sm text-gray-500 mb-4">Prueba: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">4242 4242 4242 4242</span></p>
              <form onSubmit={handlePago} className="space-y-4">
                <Input id="cardNumber" label="Número de tarjeta" placeholder="4242 4242 4242 4242" value={tarjeta.cardNumber} onChange={(e) => setTarjeta({ ...tarjeta, cardNumber: formatearTarjeta(e.target.value) })} error={errores.cardNumber} />
                <Input id="cardHolder" label="Titular" placeholder="Como aparece en la tarjeta" value={tarjeta.cardHolder} onChange={(e) => setTarjeta({ ...tarjeta, cardHolder: e.target.value })} error={errores.cardHolder} />
                <div className="grid grid-cols-3 gap-4">
                  <Input id="expiryMonth" label="Mes (MM)" placeholder="12" maxLength={2} value={tarjeta.expiryMonth} onChange={(e) => setTarjeta({ ...tarjeta, expiryMonth: e.target.value.replace(/\D/g, "") })} error={errores.expiryMonth} />
                  <Input id="expiryYear" label="Año (AA)" placeholder="27" maxLength={4} value={tarjeta.expiryYear} onChange={(e) => setTarjeta({ ...tarjeta, expiryYear: e.target.value.replace(/\D/g, "") })} error={errores.expiryYear} />
                  <Input id="cvv" label="CVV" placeholder="123" maxLength={4} value={tarjeta.cvv} onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, "") })} error={errores.cvv} />
                </div>
                {resultado && !resultado.exito && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"><XCircle className="h-4 w-4" /> {resultado.mensaje}</div>}
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={() => setPaso("informacion")} className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Volver</button>
                  <Button type="submit" size="lg" isLoading={procesando}><Lock className="h-4 w-4" /> Pagar {formatPrecio(total)}</Button>
                </div>
              </form>
            </Card>
          )}
          {paso === "confirmacion" && (
            <Card className="p-8 text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="h-8 w-8 text-emerald-600" /></div>
              <h2 className="text-2xl font-bold text-gray-900">¡Pago Exitoso!</h2>
              <p className="text-gray-500 mt-2">Tu pedido ha sido procesado correctamente.</p>
              {resultado && <div className="mt-4 bg-gray-50 rounded-lg p-4 inline-block text-left"><p className="text-sm text-gray-600"><span className="font-medium">Transacción:</span> {resultado.transactionId}</p><p className="text-sm text-gray-600"><span className="font-medium">Total:</span> {formatPrecio(total)}</p></div>}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link href="/"><Button>Volver al Inicio</Button></Link>
                <Link href="/catalogo"><Button variant="outline">Seguir Comprando</Button></Link>
              </div>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <Card className="p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Resumen</h3>
            {paso !== "confirmacion" && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.producto.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0"><img src={item.producto.imagenUrl} alt={item.producto.nombre} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{item.producto.nombre}</p><p className="text-xs text-gray-500">x{item.cantidad}</p></div>
                    <span className="text-sm font-medium">{formatPrecio(item.producto.precio * item.cantidad)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrecio(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Envío</span><span>{envio === 0 ? <span className="text-emerald-600">Gratis</span> : formatPrecio(envio)}</span></div>
              <div className="flex justify-between text-base border-t pt-2"><span className="font-semibold">Total</span><span className="font-bold text-indigo-600">{formatPrecio(total)}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
