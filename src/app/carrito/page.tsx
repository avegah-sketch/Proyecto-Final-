"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrecio } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from "lucide-react";

export default function CarritoPage() {
  const { items, subtotal, actualizarCantidad, eliminar, vaciar } = useCart();
  const envio = subtotal >= 999 ? 0 : 99;
  const total = subtotal + envio;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h1>
        <p className="text-gray-500 mt-2">Agrega productos para empezar a comprar.</p>
        <Link href="/catalogo"><Button className="mt-6">Explorar Catálogo</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Carrito de Compras</h1>
        <button onClick={vaciar} className="text-sm text-red-600 hover:text-red-700 font-medium">Vaciar carrito</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.producto.id} className="p-4 flex gap-4">
              <Link href={`/producto/${item.producto.id}`} className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.producto.imagenUrl} alt={item.producto.nombre} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/producto/${item.producto.id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-indigo-600">{item.producto.nombre}</h3>
                </Link>
                <p className="text-sm text-gray-500 mt-0.5">Talla: {item.producto.talla} | Precio: {formatPrecio(item.producto.precio)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)} className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center font-medium text-sm">{item.cantidad}</span>
                    <button onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)} className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50" disabled={item.cantidad >= item.producto.stock}><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-indigo-600">{formatPrecio(item.producto.precio * item.cantidad)}</span>
                    <button onClick={() => eliminar(item.producto.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div>
          <Card className="p-5 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{formatPrecio(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Envío</span><span className="font-medium">{envio === 0 ? <span className="text-emerald-600">Gratis</span> : formatPrecio(envio)}</span></div>
              {subtotal < 999 && <p className="text-xs text-gray-400">Agrega {formatPrecio(999 - subtotal)} más para envío gratis</p>}
              <div className="border-t pt-2 mt-2"><div className="flex justify-between text-base"><span className="font-semibold">Total</span><span className="font-bold text-indigo-600">{formatPrecio(total)}</span></div></div>
            </div>
            <Link href="/checkout"><Button size="lg" className="w-full mt-4">Proceder al Pago</Button></Link>
            <Link href="/catalogo" className="block text-center text-sm text-gray-500 hover:text-indigo-600 mt-3"><ArrowLeft className="inline h-3 w-3 mr-1" /> Seguir comprando</Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
