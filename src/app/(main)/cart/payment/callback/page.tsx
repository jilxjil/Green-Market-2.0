"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/usecart";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    const reference = searchParams.get("reference")?.trim();

    if (!reference) {
      setMessage("Missing payment reference.");
      return;
    }

    let cancelled = false;

    async function verifyPayment() {
      const res = await fetch(
        `/api/payments/verify?reference=${encodeURIComponent(reference!)}`
      );
      const data = await res.json().catch(() => ({}));

      if (cancelled) {
        return;
      }

      if (res.status === 401) {
        router.replace(`/login?next=/cart/payment/callback?reference=${encodeURIComponent(reference!)}`);
        return;
      }

      if (!res.ok) {
        const errorMessage = data.error || "Payment verification failed.";
        setMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      clearCart();
      toast.success("Payment successful.");
      router.replace(`/dashboard/buyer?order=${data.orderId ?? data.orderIds?.[0] ?? ""}`);
    }

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [clearCart, router, searchParams]);

  const isMissingReference = message.startsWith("Missing payment reference.");
  const isError = !isMissingReference && message !== "Confirming your payment...";

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      {!isError && !isMissingReference ? (
        <div className="w-full space-y-4">
          <Skeleton className="mx-auto h-10 w-10 rounded-full" />
          <Skeleton className="mx-auto h-6 w-56" />
          <Skeleton className="mx-auto h-4 w-72 max-w-full" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold">
            {isMissingReference ? "Payment reference missing" : "Payment not completed"}
          </h1>
          <p className="mt-3 text-muted-foreground">{message}</p>
          <Button asChild className="mt-6">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </>
      )}
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16">
          <Skeleton className="h-6 w-56" />
        </main>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
