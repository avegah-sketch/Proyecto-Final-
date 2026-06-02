"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { formatPrecio } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Producto } from "@/types";
import productosData from "../../../../data/seed.json";

const categoriaLabels: Record<string, string> = {
  camisetas: "Camisetas", pantalones: "Pantalones", vestidos: "Vestidos",
  chaquetas: "Chaquetas", zapatos: "Zapatos", accesorios: "Accesorios",
  ropa_interior: "Ropa Interior", deportivo: "Deportivo",
};

const todosProductos = productosData as Producto[];

export default function ProductoDetallePage() {
  const params = useParams();
  const id = Number(params.id);

  const producto: Producto | undefined = todosProductos.find((p) => p.id === id);

  const relacionados: Producto[] = useMemo(() => {
    if (!producto) return [];
    return todosProductos.filter((p) => p.id !== producto.id && p.categoria === producto.categoria).slice(0, 4);
  }, [producto]);

  if (!producto) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
        <p className="text-gray-500 mt-2">El producto que buscas no existe.</p>
        <Link href="/catalogo" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 mt-4 font-medium">
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/catalogo" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <img src={producto.imagenUrl} alt={producto.nombre} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-start gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {categoriaLabels[producto.categoria] || producto.categoria}
            </span>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              producto.stock > 5 ? "bg-emerald-100 text-emerald-800" : producto.stock > 0 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
            }`}>
              {producto.stock > 5 ? "En Stock" : producto.stock > 0 ? `Últimos ${producto.stock}` : "Agotado"}
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{producto.nombre}</h1>

          <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
            <span className="capitalize">{producto.genero}</span>
            <span className="text-gray-300">|</span>
            <span>Talla {producto.talla}</span>
          </div>

          <p className="text-3xl font-bold text-indigo-600 mt-4">{formatPrecio(producto.precio)}</p>
          <p className="text-gray-600 mt-6 leading-relaxed">{producto.descripcion}</p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Detalles del producto</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><span className="font-medium">Categoría:</span> {categoriaLabels[producto.categoria] || producto.categoria}</li>
              <li><span className="font-medium">Género:</span> {producto.genero}</li>
              <li><span className="font-medium">Talla:</span> {producto.talla}</li>
              <li><span className="font-medium">Stock:</span> {producto.stock} unidades</li>
              <li><span className="font-medium">Precio:</span> {formatPrecio(producto.precio)}</li>
            </ul>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relacionados.map((p) => (
              <Link key={p.id} href={`/producto/${p.id}`} className="group bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm hover:text-indigo-600 transition-colors">{p.nombre}</h3>
                  <span className="text-lg font-bold text-indigo-600">{formatPrecio(p.precio)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
