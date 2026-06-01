export const productStatuses = ["active", "out_of_stock", "archived"] as const;

export type ProductStatus = (typeof productStatuses)[number];

export function isProductStatus(value: string): value is ProductStatus {
  return productStatuses.includes(value as ProductStatus);
}

export function resolveProductStatus(
  stockQuantity: number,
  status?: ProductStatus | null
): ProductStatus {
  if (status === "archived") {
    return "archived";
  }

  if (status === "out_of_stock") {
    return "out_of_stock";
  }

  if (stockQuantity <= 0) {
    return "out_of_stock";
  }

  return "active";
}

export function isProductPurchasable(product: {
  status?: string | null;
  stockQuantity: number | null;
}) {
  const stockQuantity = product.stockQuantity ?? 0;
  return (
    product.status !== "archived" &&
    product.status !== "out_of_stock" &&
    stockQuantity > 0
  );
}
