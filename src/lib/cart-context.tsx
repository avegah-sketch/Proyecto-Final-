"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Producto } from "@/types";

interface CartItemLocal {
  producto: Producto;
  cantidad: number;
}

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
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function guardarCarrito(items: CartItemLocal[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemLocal[]>([]);

  useEffect(() => {
    setItems(cargarCarrito());
  }, []);

  useEffect(() => {
    guardarCarrito(items);
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotal = items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);

  const agregar = useCallback((producto: Producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { producto, cantidad }];
    });
  }, []);

  const eliminar = useCallback((productoId: number) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }, []);

  const actualizarCantidad = useCallback((productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.producto.id === productoId ? { ...i, cantidad } : i
      )
    );
  }, []);

  const vaciar = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useCallback(
    (productoId: number) => {
      const item = items.find((i) => i.producto.id === productoId);
      return item?.cantidad || 0;
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, totalItems, subtotal, agregar, eliminar, actualizarCantidad, vaciar, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
