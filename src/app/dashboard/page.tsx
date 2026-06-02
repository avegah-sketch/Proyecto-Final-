"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { obtenerSesion, cerrarSesion, Sesion } from "@/lib/auth";
import { formatPrecio } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { User, Package, ShoppingBag, LogOut } from "lucide-react";

const estadoBadge: Record<string, "info" | "warning" | "success" | "danger"> = {
  pendiente: "warning", pagado: "info", enviado: "info", entregado: "success", cancelado: "danger",
};

export default function DashboardPage() {
  const router = useRouter();
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = obtenerSesion();
    if (!s) { router.push("/auth/login"); return; }
    setSesion(s);
    fetch(`/api/pedidos?usuarioId=${s.usuario.id}`).then((r) => r.json()).then(setPedidos).catch(() => {}).finally(() => setLoading(false));
  }, [router]);

  if (!sesion) return null;

  const handleLogout = () => { cerrarSesion(); router.push("/"); router.refresh(); };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-full"><User className="h-6 w-6 text-indigo-600" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">{sesion.usuario.nombre}</h1><p className="text-sm text-gray-500 capitalize">{sesion.usuario.rol} • {sesion.usuario.email}</p></div>
        </div>
        <Button variant="ghost" onClick={handleLogout}><LogOut className="h-4 w-4" /> Salir</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-5"><div className="flex items-center gap-3"><Package className="h-8 w-8 text-indigo-600" /><div><p className="text-2xl font-bold text-gray-900">{pedidos.length}</p><p className="text-sm text-gray-500">Pedidos</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><ShoppingBag className="h-8 w-8 text-emerald-600" /><div><p className="text-2xl font-bold text-gray-900">25+</p><p className="text-sm text-gray-500">Productos</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><User className="h-8 w-8 text-amber-600" /><div><p className="text-2xl font-bold text-gray-900 capitalize">{sesion.usuario.rol}</p><p className="text-sm text-gray-500">Tipo de cuenta</p></div></div></Card>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">Historial de Pedidos</h2>
        {loading ? <p className="text-center text-gray-400 py-8">Cargando...</p>
        : pedidos.length === 0 ? (
          <div className="text-center py-8 text-gray-400"><Package className="h-12 w-12 mx-auto mb-2" /><p>No tienes pedidos aún</p><Button variant="outline" className="mt-4" onClick={() => router.push("/catalogo")}>Comprar Ahora</Button></div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido: any) => (
              <div key={pedido.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div><span className="text-sm font-medium text-gray-900">Pedido #{pedido.id}</span><span className="text-sm text-gray-500 ml-3">{new Date(pedido.fechaPedido).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</span></div>
                  <Badge variant={estadoBadge[pedido.estado] || "default"}>{pedido.estado}</Badge>
                </div>
                <div className="text-sm text-gray-500"><p>Dirección: {pedido.direccionEnvio}</p><p className="font-medium text-gray-900 mt-1">Total: {formatPrecio(pedido.total)}</p></div>
                {pedido.detalles?.length > 0 && <div className="mt-2 pt-2 border-t border-gray-100">{pedido.detalles.map((det: any) => <p key={det.id} className="text-xs text-gray-500">x{det.cantidad} - Producto #{det.productoId} ({formatPrecio(det.precioUnitario)} c/u)</p>)}</div>}
                {pedido.pago && <div className="mt-1 text-xs text-emerald-600">Pagado - ID: {pedido.pago.transactionId}</div>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
