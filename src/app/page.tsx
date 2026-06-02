import Link from "next/link";
import { db } from "@/lib/db";
import { Producto } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRight, Truck, Shield, RefreshCw, CreditCard } from "lucide-react";

function getProductos(): Producto[] {
  return db.findMany<Producto>("productos").slice(0, 8);
}

export default function HomePage() {
  const productos = getProductos();

  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Tu Estilo,{" "}
              <span className="text-indigo-200">Tu Mundo</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-indigo-100 leading-relaxed">
              Descubre las últimas tendencias en moda. Encuentra prendas únicas que expresen tu personalidad.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Explorar Catálogo
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/catalogo?genero=mujer"
                className="inline-flex items-center gap-2 bg-indigo-500/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500/50 transition-colors border border-indigo-400/50"
              >
                Colección Mujer
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Envío Gratis", desc: "En pedidos mayores a $999" },
            { icon: Shield, title: "Pago Seguro", desc: "Datos protegidos" },
            { icon: RefreshCw, title: "30 Días", desc: "Devolución gratuita" },
            { icon: CreditCard, title: "Todos los Pagos", desc: "Tarjetas y efectivo" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4 border border-gray-100">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <item.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Productos Destacados</h2>
            <p className="text-gray-500 mt-1">Lo más popular de la temporada</p>
          </div>
          <Link
            href="/catalogo"
            className="hidden sm:inline-flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700"
          >
            Ver todos los productos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">¿Listo para renovar tu guardarropa?</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Únete a nuestra comunidad y descubre las mejores prendas con los mejores precios.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Comprar Ahora
            </Link>
            <Link
              href="/auth/registro"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-indigo-600"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
