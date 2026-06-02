"use client";

import { FiltrosProducto, CategoriaProducto, Talla, Genero } from "@/types";
import { SlidersHorizontal, X } from "lucide-react";

const categorias: { value: CategoriaProducto; label: string }[] = [
  { value: "camisetas", label: "Camisetas" },
  { value: "pantalones", label: "Pantalones" },
  { value: "vestidos", label: "Vestidos" },
  { value: "chaquetas", label: "Chaquetas" },
  { value: "zapatos", label: "Zapatos" },
  { value: "accesorios", label: "Accesorios" },
  { value: "deportivo", label: "Deportivo" },
];

const tallas: Talla[] = ["XS", "S", "M", "L", "XL", "XXL"];
const generos: { value: Genero; label: string }[] = [
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
  { value: "unisex", label: "Unisex" },
];

interface Props {
  filtros: FiltrosProducto;
  onChange: (filtros: FiltrosProducto) => void;
  onLimpiar: () => void;
}

export default function ProductFilters({ filtros, onChange, onLimpiar }: Props) {
  const actualizar = <K extends keyof FiltrosProducto>(key: K, value: FiltrosProducto[K]) => {
    onChange({ ...filtros, [key]: value });
  };

  const hayFiltros = filtros.categoria || filtros.talla || filtros.genero || filtros.precioMin || filtros.precioMax;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          <span className="font-semibold text-gray-900 text-sm">Filtros</span>
        </div>
        {hayFiltros && (
          <button onClick={onLimpiar} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            <X className="h-3 w-3" /> Limpiar
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categoría</h4>
        <div className="space-y-2">
          {categorias.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="categoria"
                checked={filtros.categoria === cat.value}
                onChange={() => actualizar("categoria", cat.value === filtros.categoria ? undefined : cat.value)}
                className="accent-indigo-600"
              />
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
              <input
                type="radio"
                name="genero"
                checked={filtros.genero === g.value}
                onChange={() => actualizar("genero", g.value === filtros.genero ? undefined : g.value)}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">{g.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Talla</h4>
        <div className="flex flex-wrap gap-2">
          {tallas.map((t) => (
            <button
              key={t}
              onClick={() => actualizar("talla", t === filtros.talla ? undefined : t)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                filtros.talla === t
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Precio</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filtros.precioMin || ""}
            onChange={(e) => actualizar("precioMin", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-hidden"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filtros.precioMax || ""}
            onChange={(e) => actualizar("precioMax", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
}
