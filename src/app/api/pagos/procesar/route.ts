import { NextResponse } from "next/server";
import { luhnCheck, generarTransactionId } from "@/lib/utils";

interface PagoRequest {
  monto: number;
  tarjeta: {
    numero: string;
    titular: string;
    mesExpiracion: string;
    anioExpiracion: string;
    cvv: string;
  };
}

export async function POST(request: Request) {
  const body: PagoRequest = await request.json();
  const { monto, tarjeta } = body;

  if (!monto || !tarjeta) {
    return NextResponse.json(
      { exito: false, mensaje: "Datos de pago incompletos" },
      { status: 400 }
    );
  }

  if (!tarjeta.numero || !luhnCheck(tarjeta.numero)) {
    return NextResponse.json(
      { exito: false, mensaje: "Número de tarjeta inválido" },
      { status: 400 }
    );
  }

  if (!tarjeta.cvv || !/^\d{3,4}$/.test(tarjeta.cvv)) {
    return NextResponse.json(
      { exito: false, mensaje: "CVV inválido" },
      { status: 400 }
    );
  }

  const mesActual = new Date().getMonth() + 1;
  const anioActual = Number(new Date().getFullYear().toString().slice(-2));
  const mesExp = parseInt(tarjeta.mesExpiracion, 10);
  const anioExp = parseInt(tarjeta.anioExpiracion.length === 4 ? tarjeta.anioExpiracion.slice(-2) : tarjeta.anioExpiracion, 10);

  if (anioExp < anioActual || (anioExp === anioActual && mesExp < mesActual)) {
    return NextResponse.json(
      { exito: false, mensaje: "La tarjeta está vencida" },
      { status: 400 }
    );
  }

  // Simulación de procesamiento asíncrono
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simular aprobación (95% de tasa de éxito)
  const aprobado = Math.random() < 0.95;

  if (!aprobado) {
    return NextResponse.json(
      {
        exito: false,
        mensaje: "La transacción fue rechazada. Verifica los datos e intenta de nuevo.",
      },
      { status: 402 }
    );
  }

  const transactionId = generarTransactionId();

  return NextResponse.json({
    exito: true,
    transactionId,
    mensaje: "Pago procesado exitosamente",
    monto,
    ultimosDigitos: tarjeta.numero.slice(-4),
  });
}
