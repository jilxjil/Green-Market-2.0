"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/usecart";

export default function CartPage() {
  const router = useRouter();
  const { items, isHydrated, subtotal, updateQuantity, removeItem, clearCart } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setIsCheckingOut(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      router.push("/login?next=/cart");
      return;
    }

    if (!res.ok) {
      setError(data.error || "Unable to place order.");
      setIsCheckingOut(false);
      return;
    }

    clearCart();
    router.push(`/dashboard/buyer?order=${data.orderId}`);
  }

  if (!isHydrated) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-muted-foreground">Loading cart...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-lg border bg-card p-8 text-center">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Add fresh produce from the marketplace to start an order.
          </p>
          <Button asChild className="mt-6">
            <Link href="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Cart</h1>
          <p className="text-muted-foreground">
            Review your items before placing an order.
          </p>
        </div>

        {items.map((item) => (
          <div
            key={item.productId}
            className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-[96px_minmax(0,1fr)_120px_44px]"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-24 w-24 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-md bg-green-accent/30 text-sm font-semibold text-primary">
                GM
              </div>
            )}

            <div className="min-w-0">
              <Link
                href={`/marketplace/${item.productId}`}
                className="text-lg font-semibold hover:text-primary"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                GH₵ {item.price} each
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.stockQuantity} available
              </p>
            </div>

            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Qty
              </span>
              <input
                className="h-10 w-full rounded-md border bg-background px-3"
                min={1}
                max={item.stockQuantity || 1}
                type="number"
                value={item.quantity}
                onChange={(event) =>
                  updateQuantity(item.productId, Number(event.target.value))
                }
              />
            </label>

            <button
              type="button"
              aria-label={`Remove ${item.title}`}
              className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => removeItem(item.productId)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </section>

      <aside className="h-fit rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="mt-5 flex items-center justify-between border-b pb-4">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-2xl font-bold">GH₵ {subtotal}</span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          No online payment yet. Seller will confirm your order.
        </p>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        <Button
          className="mt-5 h-11 w-full"
          type="button"
          disabled={isCheckingOut}
          onClick={checkout}
        >
          {isCheckingOut ? "Placing order..." : "Place order"}
        </Button>
        <Button
          className="mt-3 h-11 w-full"
          type="button"
          variant="outline"
          onClick={clearCart}
        >
          Clear cart
        </Button>
      </aside>
    </main>
  );
}
