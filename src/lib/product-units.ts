export const productUnitOptions = [
  "kg",
  "g",
  "crate",
  "box",
  "bag",
  "sack",
  "bunch",
  "bundle",
  "piece",
  "dozen",
  "litre",
  "unit",
] as const;

export function getProductUnitLabel(unitOfMeasure?: string | null) {
  return unitOfMeasure?.trim() || "unit";
}

export function formatProductPrice(price: number | string, unitOfMeasure?: string | null) {
  return `GH₵ ${price} / ${getProductUnitLabel(unitOfMeasure)}`;
}

export function formatProductAvailability(
  stockQuantity?: number | null,
  unitOfMeasure?: string | null
) {
  const unit = getProductUnitLabel(unitOfMeasure);
  return `${stockQuantity ?? 0} ${unit} available`;
}
