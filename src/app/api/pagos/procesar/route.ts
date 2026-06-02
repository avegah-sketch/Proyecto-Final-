import { NextResponse } from "next/server";
import { luhnCheck, generarTransactionId } from "@/lib/utils";

export async function POST(request: Request) {
  const { monto, tarjeta } = await request.json();
  if (!monto || !tarjeta) return NextResponse.json({ exito: false, mensaje: "Datos incompletos" }, { status: 400 });
  if (!luhnCheck(tarjeta.numero)) return NextResponse.json({ exito: false, mensaje: "Número de tarjeta inválido" }, { status: 400 });
  if (!tarjeta.cvv || !/^\d{3,4}$/.test(tarjeta.cvv)) return NextResponse.json({ exito: false, mensaje: "CVV inválido" }, { status: 400 });

  const mesActual = new Date().getMonth() + 1;
  const anioActual = Number(new Date().getFullYear().toString().slice(-2));
  const mesExp = parseInt(tarjeta.mesExpiracion, 10);
  const anioExp = parseInt(tarjeta.anioExpiracion.length === 4 ? tarjeta.anioExpiracion.slice(-2) : tarjeta.anioExpiracion, 10);
  if (anioExp < anioActual || (anioExp === anioActual && mesExp < mesActual)) return NextResponse.json({ exito: false, mensaje: "Tarjeta vencida" }, { status: 400 });

  await new Promise((resolve) => setTimeout(resolve, 1500));
  const aprobado = Math.random() < 0.95;

  if (!aprobado) return NextResponse.json({ exito: false, mensaje: "Transacción rechazada" }, { status: 402 });

  return NextResponse.json({ exito: true, transactionId: generarTransactionId(), mensaje: "Pago exitoso", monto, ultimosDigitos: tarjeta.numero.slice(-4) });
}
