"use client";

import { useEffect, useMemo, useState } from "react";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  imageUrl: string | null;
  stockQuantity: number;
  quantity: number;
}

const CART_STORAGE_KEY = "green-market-cart";

function normalizeQuantity(quantity: number, stockQuantity: number) {
  const max = Math.max(1, stockQuantity || 1);
  return Math.min(Math.max(1, quantity), max);
}

function readStoredCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(CART_STORAGE_KEY);
    return value ? (JSON.parse(value) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setItems(readStoredCart());
      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.productId === item.productId
      );

      if (!existingItem) {
        return [
          ...currentItems,
          {
            ...item,
            quantity: normalizeQuantity(quantity, item.stockQuantity),
          },
        ];
      }

      return currentItems.map((cartItem) =>
        cartItem.productId === item.productId
          ? {
              ...cartItem,
              ...item,
              quantity: normalizeQuantity(
                cartItem.quantity + quantity,
                item.stockQuantity
              ),
            }
          : cartItem
      );
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: normalizeQuantity(quantity, item.stockQuantity),
            }
          : item
      )
    );
  }

  function removeItem(productId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId)
    );
  }

  function clearCart() {
    setItems([]);
  }

  return {
    items,
    isHydrated,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
