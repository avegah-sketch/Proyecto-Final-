import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Pedido, DetallePedido, Pago, Producto, CarritoItem } from "@/types";

export async function GET(request: Request) {
  const usuarioId = Number(new URL(request.url).searchParams.get("usuarioId"));
  if (!usuarioId) return NextResponse.json({ error: "usuarioId requerido" }, { status: 400 });
  const pedidos: Pedido[] = db.findWhere("pedidos", (p: Pedido) => p.usuarioId === usuarioId);
  const pedidosConDetalles = pedidos.map((pedido) => ({
    ...pedido,
    detalles: db.findWhere("detallePedidos", (d: DetallePedido) => d.pedidoId === pedido.id),
    pago: db.findWhere("pagos", (p: Pago) => p.pedidoId === pedido.id).pop() || null,
  }));
  return NextResponse.json(pedidosConDetalles);
}

export async function POST(request: Request) {
  try {
    const { usuarioId, direccionEnvio, items: itemsData } = await request.json();
    if (!usuarioId || !direccionEnvio || !itemsData?.length) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    const productos: Producto[] = db.findMany("productos");
    let total = 0;
    const detalles = itemsData.map((item: { productoId: number; cantidad: number }) => {
      const producto = productos.find((p) => p.id === item.productoId);
      if (!producto) throw new Error(`Producto ${item.productoId} no encontrado`);
      total += producto.precio * item.cantidad;
      return { productoId: item.productoId, cantidad: item.cantidad, precioUnitario: producto.precio };
    });
    const pedido = db.create<Pedido>("pedidos", { usuarioId, fechaPedido: new Date().toISOString(), total, estado: "pendiente", direccionEnvio });
    for (const det of detalles) db.create<DetallePedido>("detallePedidos", { pedidoId: pedido.id, ...det });
    const itemsCarrito: CarritoItem[] = db.findWhere("carritoItems", (i: CarritoItem) => i.usuarioId === usuarioId);
    db.deleteMany("carritoItems", itemsCarrito.map((i) => i.id));
    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error" }, { status: 500 });
  }
}
