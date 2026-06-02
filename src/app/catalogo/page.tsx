"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Producto, FiltrosProducto, CategoriaProducto, Genero, Talla } from "@/types";
import { formatPrecio } from "@/lib/utils";
import { SlidersHorizontal, X, Search } from "lucide-react";
import productosData from "../../../data/seed.json";
import { Suspense } from "react";

const categorias: { value: CategoriaProducto; label: string }[] = [
  { value: "camisetas", label: "Camisetas" }, { value: "pantalones", label: "Pantalones" },
  { value: "vestidos", label: "Vestidos" }, { value: "chaquetas", label: "Chaquetas" },
  { value: "zapatos", label: "Zapatos" }, { value: "accesorios", label: "Accesorios" },
  { value: "deportivo", label: "Deportivo" },
];
const tallas: Talla[] = ["XS", "S", "M", "L", "XL", "XXL"];
const generos: { value: Genero; label: string }[] = [
  { value: "hombre", label: "Hombre" }, { value: "mujer", label: "Mujer" }, { value: "unisex", label: "Unisex" },
];
const categoriaLabels: Record<string, string> = {
  camisetas: "Camisetas", pantalones: "Pantalones", vestidos: "Vestidos",
  chaquetas: "Chaquetas", zapatos: "Zapatos", accesorios: "Accesorios",
  ropa_interior: "Ropa Interior", deportivo: "Deportivo",
};

const todosProductos = productosData as Producto[];

function CatalogContent() {
  const searchParams = useSearchParams();
  const [filtros, setFiltros] = useState<FiltrosProducto>({
    categoria: (searchParams.get("categoria") as CategoriaProducto) || undefined,
    busqueda: searchParams.get("busqueda") || undefined,
  });
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const actualizar = <K extends keyof FiltrosProducto>(key: K, value: FiltrosProducto[K]) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
  };

  const productosFiltrados = useMemo(() => {
    return todosProductos.filter((p) => {
      if (filtros.categoria && p.categoria !== filtros.categoria) return false;
      if (filtros.talla && p.talla !== filtros.talla) return false;
      if (filtros.genero && p.genero !== filtros.genero) return false;
      if (filtros.precioMin !== undefined && p.precio < filtros.precioMin) return false;
      if (filtros.precioMax !== undefined && p.precio > filtros.precioMax) return false;
      if (filtros.busqueda) {
        const q = filtros.busqueda.toLowerCase();
        if (!p.nombre.toLowerCase().includes(q) && !p.descripcion.toLowerCase().includes(q) && !categoriaLabels[p.categoria]?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filtros]);

  const limpiarFiltros = () => setFiltros({});
  const hayFiltros = filtros.categoria || filtros.talla || filtros.genero || filtros.precioMin || filtros.precioMax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Catálogo</h1>
          <p className="text-gray-500 text-sm mt-1">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado
            {filtros.busqueda && <> para &quot;{filtros.busqueda}&quot;</>}
          </p>
        </div>
        <button onClick={() => setFiltrosAbiertos(!filtrosAbiertos)} className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <SlidersHorizontal className="h-4 w-4" /> Filtros
        </button>
      </div>

      <div className="flex gap-6">
        <aside className={`lg:block w-64 flex-shrink-0 ${filtrosAbiertos ? "block" : "hidden"}`}>
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-900 text-sm">Filtros</span>
              </div>
              {hayFiltros && (
                <button onClick={limpiarFiltros} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  <X className="h-3 w-3" /> Limpiar
                </button>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categoría</h4>
              <div className="space-y-2">
                {categorias.map((cat) => (
                  <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="categoria" checked={filtros.categoria === cat.value} onChange={() => actualizar("categoria", cat.value === filtros.categoria ? undefined : cat.value as CategoriaProducto)} className="accent-indigo-600" />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Género</h4>
              <div className="space-y-2">
                {generos.map((g) => (
                  <label key={g.value} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="genero" checked={filtros.genero === g.value} onChange={() => actualizar("genero", g.value === filtros.genero ? undefined : g.value as Genero)} className="accent-indigo-600" />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">{g.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Talla</h4>
              <div className="flex flex-wrap gap-2">
                {tallas.map((t) => (
                  <button key={t} onClick={() => actualizar("talla", t === filtros.talla ? undefined : t)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${filtros.talla === t ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"}`}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Precio</h4>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={filtros.precioMin || ""} onChange={(e) => actualizar("precioMin", e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-hidden" />
                <span className="text-gray-400">-</span>
                <input type="number" placeholder="Max" value={filtros.precioMax || ""} onChange={(e) => actualizar("precioMax", e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-hidden" />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-lg">No se encontraron productos</p>
              <p className="text-gray-400 text-sm mt-1">Intenta ajustar los filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((producto) => (
                <Link key={producto.id} href={`/producto/${producto.id}`} className="group bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img src={producto.imagenUrl} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {categoriaLabels[producto.categoria] || producto.categoria}
                    </div>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Cargando catálogo...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
