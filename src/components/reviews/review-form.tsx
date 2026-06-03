"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function ReviewForm({
  orderId,
  productId,
  productTitle,
}: {
  orderId: string;
  productId: string;
  productTitle?: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  async function submitReview(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, productId, rating, comment }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error || "Unable to submit review.");
      return;
    }

    toast.success("Review submitted.");
    router.refresh();
  }

  return (
    <form onSubmit={submitReview} className="mt-3 rounded-lg border bg-background p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">
          Rate {productTitle ?? "this product"}
        </span>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={value <= rating ? "text-yellow-600" : "text-muted-foreground"}
            onClick={() => setRating(value)}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
          >
            <Star className="h-4 w-4 fill-current" />
          </button>
        ))}
      </div>
      <textarea
        className="mt-3 min-h-20 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder="Share a quick note about the product..."
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={1000}
      />
      <Button type="submit" size="sm" disabled={saving}>
        {saving ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}
