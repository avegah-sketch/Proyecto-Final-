"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatPrecio } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/product/ProductCard";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Producto } from "@/types";

const categoriaLabels: Record<string, string> = {
  camisetas: "Camisetas", pantalones: "Pantalones", vestidos: "Vestidos",
  chaquetas: "Chaquetas", zapatos: "Zapatos", accesorios: "Accesorios",
  ropa_interior: "Ropa Interior", deportivo: "Deportivo",
};

export default function ProductoDetallePage() {
  const params = useParams();
  const { agregar, itemCount } = useCart();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);

  const id = Number(params.id);

  useEffect(() => {
    Promise.all([
      fetch(`/api/productos/${id}`).then((r) => r.json()),
      fetch("/api/productos").then((r) => r.json()),
    ])
      .then(([productoData, todos]) => {
        if (productoData.error) {
          setProducto(null);
        } else {
          setProducto(productoData);
          setRelacionados(
            todos.filter(
              (p: Producto) => p.id !== productoData.id && p.categoria === productoData.categoria
            ).slice(0, 4)
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAgregar = () => {
    if (!producto) return;
    agregar(producto, cantidad);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Cargando producto...</div>;
  }

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
            <Badge variant="info">{categoriaLabels[producto.categoria] || producto.categoria}</Badge>
            <Badge variant={producto.stock > 5 ? "success" : producto.stock > 0 ? "warning" : "danger"}>
              {producto.stock > 5 ? "En Stock" : producto.stock > 0 ? `Últimos ${producto.stock}` : "Agotado"}
            </Badge>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{producto.nombre}</h1>

          <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
            <span className="capitalize">{producto.genero}</span>
            <span className="text-gray-300">|</span>
            <span>Talla {producto.talla}</span>
          </div>

          <p className="text-3xl font-bold text-indigo-600 mt-4">{formatPrecio(producto.precio)}</p>
          <p className="text-gray-600 mt-6 leading-relaxed">{producto.descripcion}</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Cantidad</label>
              <div className="flex items-center gap-3 mt-1">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-50">-</button>
                <span className="w-10 text-center font-semibold">{cantidad}</span>
                <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-50" disabled={cantidad >= producto.stock}>+</button>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={handleAgregar} disabled={producto.stock === 0}>
              {added ? <><Check className="h-5 w-5" /> Agregado al carrito</> : <><ShoppingCart className="h-5 w-5" /> Agregar al Carrito</>}
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Detalles del producto</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><span className="font-medium">Categoría:</span> {categoriaLabels[producto.categoria] || producto.categoria}</li>
              <li><span className="font-medium">Género:</span> {producto.genero}</li>
              <li><span className="font-medium">Talla:</span> {producto.talla}</li>
              <li><span className="font-medium">Stock:</span> {producto.stock} unidades</li>
            </ul>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relacionados.map((p) => <ProductCard key={p.id} producto={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
