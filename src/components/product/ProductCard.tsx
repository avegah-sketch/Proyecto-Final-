import Link from "next/link";
import { Producto } from "@/types";
import { formatPrecio } from "@/lib/utils";

const categoriaLabels: Record<string, string> = {
  camisetas: "Camisetas", pantalones: "Pantalones", vestidos: "Vestidos",
  chaquetas: "Chaquetas", zapatos: "Zapatos", accesorios: "Accesorios",
  ropa_interior: "Ropa Interior", deportivo: "Deportivo",
};

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <Link href={`/producto/${producto.id}`} className="group bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={producto.imagenUrl}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {categoriaLabels[producto.categoria] || producto.categoria}
          </span>
        </div>
        {producto.stock <= 5 && producto.stock > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Últimos {producto.stock}</span>
          </div>
        )}
        {producto.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Agotado</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm hover:text-indigo-600 transition-colors">{producto.nombre}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500 capitalize">{producto.genero}</span>
          <span className="text-gray-300">|</span>
          <span className="text-xs text-gray-500">Talla {producto.talla}</span>
        </div>
        <div className="mt-auto pt-3">
          <span className="text-lg font-bold text-indigo-600">{formatPrecio(producto.precio)}</span>
        </div>
      </div>
    </Link>
  );
}
