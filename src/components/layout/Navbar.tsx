"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X, Search, Store } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { obtenerSesion, cerrarSesion } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { totalItems } = useCart();

  const sesion = obtenerSesion();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?busqueda=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    cerrarSesion();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Store className="h-7 w-7" />
            <span className="hidden sm:inline">FashionMarket</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium text-sm">Inicio</Link>
            <Link href="/catalogo" className="text-gray-700 hover:text-indigo-600 font-medium text-sm">Catálogo</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link href="/carrito" className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {sesion ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/dashboard" className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
                  <User className="h-5 w-5" />
                </Link>
                <span className="text-sm text-gray-500 hidden lg:inline">{sesion.usuario.nombre}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Salir</Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button size="sm">Ingresar</Button>
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <Button type="submit" size="sm">Buscar</Button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Inicio</Link>
            <Link href="/catalogo" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Catálogo</Link>
            {sesion ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Mi Perfil</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">Cerrar Sesión</button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Iniciar Sesión</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
