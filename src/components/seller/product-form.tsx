"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ImageUploadField from "@/components/marketplace/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productUnitOptions } from "@/lib/product-units";

export interface ProductFormValues {
  title: string;
  description: string;
  category: string;
  price: string;
  unitOfMeasure: string;
  stockQuantity: string;
  imageUrl: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: ProductFormValues;
}

const defaultValues: ProductFormValues = {
  title: "",
  description: "",
  category: "vegetables",
  price: "",
  unitOfMeasure: "kg",
  stockQuantity: "",
  imageUrl: "",
};

export default function ProductForm({
  mode,
  productId,
  initialValues = defaultValues,
}: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormValues>(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category.trim() || undefined,
      price: Number(formData.price),
      unitOfMeasure: formData.unitOfMeasure.trim(),
      stockQuantity: Number(formData.stockQuantity),
      imageUrl: formData.imageUrl.trim() || undefined,
    };

    const url =
      mode === "create" ? "/api/products" : `/api/products/${productId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save product.");
      return;
    }

    router.push("/dashboard/seller/products");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-lg flex-col gap-4"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Product title</Label>
        <Input
          id="title"
          placeholder="e.g. Fresh tomatoes"
          value={formData.title}
          onChange={(event) =>
            setFormData({ ...formData, title: event.target.value })
          }
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="Describe your product"
          value={formData.description}
          onChange={(event) =>
            setFormData({ ...formData, description: event.target.value })
          }
          rows={4}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          placeholder="vegetables, fruits, grains..."
          value={formData.category}
          onChange={(event) =>
            setFormData({ ...formData, category: event.target.value })
          }
          className="w-full"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price per unit (GH₵)</Label>
          <Input
            id="price"
            type="number"
            min={1}
            inputMode="numeric"
            value={formData.price}
            onChange={(event) =>
              setFormData({ ...formData, price: event.target.value })
            }
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitOfMeasure">Unit of measure</Label>
          <Input
            id="unitOfMeasure"
            list="product-unit-options"
            placeholder="kg, crate, bunch..."
            value={formData.unitOfMeasure}
            onChange={(event) =>
              setFormData({ ...formData, unitOfMeasure: event.target.value })
            }
            required
            className="w-full"
          />
          <datalist id="product-unit-options">
            {productUnitOptions.map((unit) => (
              <option key={unit} value={unit} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stockQuantity">Stock units available</Label>
        <Input
          id="stockQuantity"
          type="number"
          min={0}
          inputMode="numeric"
          value={formData.stockQuantity}
          onChange={(event) =>
            setFormData({ ...formData, stockQuantity: event.target.value })
          }
          required
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          This is the number of {formData.unitOfMeasure || "units"} available for sale.
        </p>
      </div>

      <ImageUploadField
        value={formData.imageUrl}
        onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create product"
              : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
