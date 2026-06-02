"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Producto, FiltrosProducto, CategoriaProducto } from "@/types";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import { Menu } from "lucide-react";
import { Suspense } from "react";

const categoriaLabels: Record<string, string> = {
  camisetas: "Camisetas", pantalones: "Pantalones", vestidos: "Vestidos",
  chaquetas: "Chaquetas", zapatos: "Zapatos", accesorios: "Accesorios",
  ropa_interior: "Ropa Interior", deportivo: "Deportivo",
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosProducto>({
    categoria: (searchParams.get("categoria") as CategoriaProducto) || undefined,
    busqueda: searchParams.get("busqueda") || undefined,
  });
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      if (filtros.categoria && p.categoria !== filtros.categoria) return false;
      if (filtros.talla && p.talla !== filtros.talla) return false;
      if (filtros.genero && p.genero !== filtros.genero) return false;
      if (filtros.precioMin !== undefined && p.precio < filtros.precioMin) return false;
      if (filtros.precioMax !== undefined && p.precio > filtros.precioMax) return false;
      if (filtros.busqueda) {
        const q = filtros.busqueda.toLowerCase();
        if (
          !p.nombre.toLowerCase().includes(q) &&
          !p.descripcion.toLowerCase().includes(q) &&
          !categoriaLabels[p.categoria]?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [productos, filtros]);

  const limpiarFiltros = () => setFiltros({});

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Cargando productos...</div>;
  }

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
        <button
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Menu className="h-4 w-4" />
          Filtros
        </button>
      </div>

      <div className="flex gap-6">
        <aside className={`lg:block w-64 flex-shrink-0 ${filtrosAbiertos ? "block" : "hidden"}`}>
          <ProductFilters filtros={filtros} onChange={setFiltros} onLimpiar={limpiarFiltros} />
        </aside>

        <div className="flex-1 min-w-0">
          <ProductGrid productos={productosFiltrados} />
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
