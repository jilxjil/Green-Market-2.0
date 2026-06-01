import ProductForm from "@/components/seller/product-form";

export default function NewProductPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create product</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          List a new item on the marketplace.
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}
