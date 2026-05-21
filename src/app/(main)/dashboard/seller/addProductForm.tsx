"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          price: Number(price),
        }),
      });

      const data = await res.json();

      console.log(data);

      if (res.ok) {
        setTitle("");
        setPrice("");

        router.refresh();
      }

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">
        Add Product
      </h2>

      <input
        className="border p-2 w-full"
        placeholder="Product title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
      />

      <button
        onClick={submit}
        disabled={loading}
        className="border px-4 py-2"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </div>
  );
}