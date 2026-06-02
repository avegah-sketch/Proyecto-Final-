"use client";

import { Producto } from "@/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <p className="text-gray-400 text-lg">No se encontraron productos con los filtros seleccionados.</p>
        <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros o busca otros términos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
