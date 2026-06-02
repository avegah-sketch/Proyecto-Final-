import Link from "next/link";
import { Store, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Store className="h-6 w-6 text-indigo-400" />
              FashionMarket
            </div>
            <p className="text-sm text-gray-400">
              Tu tienda de ropa favorita. Encuentra las mejores prendas al mejor precio.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-indigo-400 transition-colors">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-indigo-400 transition-colors">Catálogo</Link></li>
              <li><Link href="/carrito" className="hover:text-indigo-400 transition-colors">Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogo?categoria=camisetas" className="hover:text-indigo-400 transition-colors">Camisetas</Link></li>
              <li><Link href="/catalogo?categoria=pantalones" className="hover:text-indigo-400 transition-colors">Pantalones</Link></li>
              <li><Link href="/catalogo?categoria=vestidos" className="hover:text-indigo-400 transition-colors">Vestidos</Link></li>
              <li><Link href="/catalogo?categoria=zapatos" className="hover:text-indigo-400 transition-colors">Zapatos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-indigo-400" /> contacto@fashionmarket.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-indigo-400" /> +52 555-123-4567</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-400" /> Ciudad de México, MX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FashionMarket. Todos los derechos reservados.</p>
          <p className="mt-1">Proyecto Final - Marketplace de Ropa</p>
        </div>
      </div>
    </footer>
  );
}
