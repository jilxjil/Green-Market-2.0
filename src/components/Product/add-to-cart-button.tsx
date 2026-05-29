"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/usecart";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
    stockQuantity: number | null;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const stockQuantity = product.stockQuantity ?? 0;
  const isOutOfStock = stockQuantity <= 0;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      stockQuantity,
    });
    setAdded(true);
  }

  if (added) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 px-5">
          <Link href="/cart">View cart</Link>
        </Button>
        <Button
          className="h-11 px-5"
          type="button"
          variant="outline"
          onClick={() => setAdded(false)}
        >
          Keep shopping
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="h-11 gap-2 px-5"
      type="button"
      disabled={isOutOfStock}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="h-4 w-4" />
      {isOutOfStock ? "Out of stock" : "Add to cart"}
    </Button>
  );
}
