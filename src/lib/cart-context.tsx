"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Producto } from "@/types";

interface CartItemLocal { producto: Producto; cantidad: number }

interface CartContextType {
  items: CartItemLocal[];
  totalItems: number;
  subtotal: number;
  agregar: (producto: Producto, cantidad?: number) => void;
  eliminar: (productoId: number) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
  itemCount: (productoId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_KEY = "marketplace_cart";

function cargarCarrito(): CartItemLocal[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemLocal[]>([]);
  useEffect(() => { setItems(cargarCarrito()); }, []);
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items]);

  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);
  const subtotal = items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0);

  const agregar = useCallback((producto: Producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      return existente
        ? prev.map((i) => i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i)
        : [...prev, { producto, cantidad }];
    });
  }, []);

  const eliminar = useCallback((productoId: number) => setItems((prev) => prev.filter((i) => i.producto.id !== productoId)), []);
  const actualizarCantidad = useCallback((productoId: number, cantidad: number) => {
    if (cantidad <= 0) { setItems((prev) => prev.filter((i) => i.producto.id !== productoId)); return; }
    setItems((prev) => prev.map((i) => i.producto.id === productoId ? { ...i, cantidad } : i));
  }, []);
  const vaciar = useCallback(() => setItems([]), []);
  const itemCount = useCallback((productoId: number) => items.find((i) => i.producto.id === productoId)?.cantidad || 0, [items]);

  return (
    <CartContext.Provider value={{ items, totalItems, subtotal, agregar, eliminar, actualizarCantidad, vaciar, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
}
