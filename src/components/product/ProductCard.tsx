"use client";

import Link from "next/link";
import { Producto } from "@/types";
import { formatPrecio } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useCart } from "@/lib/cart-context";

const categoriaLabels: Record<string, string> = {
  camisetas: "Camisetas", pantalones: "Pantalones", vestidos: "Vestidos",
  chaquetas: "Chaqueta", zapatos: "Zapatos", accesorios: "Accesorios",
  ropa_interior: "Ropa Interior", deportivo: "Deportivo",
};

export default function ProductCard({ producto }: { producto: Producto }) {
  const { agregar, itemCount } = useCart();

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <Link href={`/producto/${producto.id}`} className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={producto.imagenUrl}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="info">{categoriaLabels[producto.categoria] || producto.categoria}</Badge>
        </div>
        {producto.stock <= 5 && producto.stock > 0 && (
          <div className="absolute top-2 right-2">
            <Badge variant="warning">Últimos {producto.stock}</Badge>
          </div>
        )}
        {producto.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger">Agotado</Badge>
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/producto/${producto.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-indigo-600 transition-colors">
            {producto.nombre}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500 capitalize">{producto.genero}</span>
          <span className="text-gray-300">|</span>
          <span className="text-xs text-gray-500">Talla {producto.talla}</span>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">{formatPrecio(producto.precio)}</span>
          <button
            onClick={() => agregar(producto)}
            disabled={producto.stock === 0}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Agregar al carrito"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
        {itemCount(producto.id) > 0 && (
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            {itemCount(producto.id)} en tu carrito
          </p>
        )}
      </div>
    </div>
  );
}
