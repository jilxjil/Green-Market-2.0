import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { getProductsByIds } from "@/lib/orders";
import { isProductPurchasable } from "@/lib/products";

export interface CheckoutRequestItem {
  productId: string;
  quantity: number;
}

export interface ValidatedCheckoutItem {
  product: Awaited<ReturnType<typeof getProductsByIds>>[number];
  quantity: number;
  lineTotal: number;
}

export type CheckoutValidationResult =
  | {
      ok: true;
      shippingAddress: string;
      validItems: ValidatedCheckoutItem[];
      itemsBySeller: Map<string, ValidatedCheckoutItem[]>;
      totalInCedis: number;
    }
  | { ok: false; error: string; status: number };

export function normalizeCheckoutItems(items: unknown): CheckoutRequestItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (
        !item ||
        typeof item !== "object" ||
        !("productId" in item) ||
        !("quantity" in item)
      ) {
        return null;
      }

      return {
        productId: String(item.productId),
        quantity: Number(item.quantity),
      };
    })
    .filter(
      (item): item is CheckoutRequestItem =>
        !!item && item.productId.length > 0 && Number.isInteger(item.quantity)
    );
}

export async function validateCheckout(
  items: unknown,
  shippingAddress: unknown
): Promise<CheckoutValidationResult> {
  const normalizedItems = normalizeCheckoutItems(items);
  const address = String(shippingAddress ?? "").trim();

  if (normalizedItems.length === 0) {
    return { ok: false, error: "Cart is empty", status: 400 };
  }

  if (address.length < 8) {
    return { ok: false, error: "Shipping address is required", status: 400 };
  }

  const productIds = [...new Set(normalizedItems.map((item) => item.productId))];
  const dbProducts = await getProductsByIds(productIds);

  if (dbProducts.length !== productIds.length) {
    return {
      ok: false,
      error: "One or more products are no longer available",
      status: 400,
    };
  }

  const productsById = new Map(dbProducts.map((product) => [product.id, product]));

  const checkoutItems = normalizedItems.map((item) => {
    const product = productsById.get(item.productId);
    const stockQuantity = product?.stockQuantity ?? 0;

    if (
      !product ||
      !isProductPurchasable(product) ||
      item.quantity < 1 ||
      item.quantity > stockQuantity
    ) {
      return null;
    }

    return {
      product,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    };
  });

  if (checkoutItems.some((item) => item === null)) {
    return {
      ok: false,
      error: "One or more cart quantities exceed available stock",
      status: 400,
    };
  }

  const validItems = checkoutItems.filter(
    (item): item is ValidatedCheckoutItem => item !== null
  );
  const itemsBySeller = new Map<string, ValidatedCheckoutItem[]>();

  for (const item of validItems) {
    const sellerItems = itemsBySeller.get(item.product.sellerId) ?? [];
    sellerItems.push(item);
    itemsBySeller.set(item.product.sellerId, sellerItems);
  }

  const totalInCedis = validItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    ok: true,
    shippingAddress: address,
    validItems,
    itemsBySeller,
    totalInCedis,
  };
}

export interface CreatedPendingOrder {
  orderId: string;
  sellerId: string;
  itemCount: number;
}

export async function createPendingOrders(
  buyerProfileId: string,
  itemsBySeller: Map<string, ValidatedCheckoutItem[]>,
  shippingAddress: string
) {
  return db.transaction(async (tx) => {
    const createdOrders: CreatedPendingOrder[] = [];

    for (const [sellerId, sellerItems] of itemsBySeller.entries()) {
      const total = sellerItems.reduce((sum, item) => sum + item.lineTotal, 0);

      const [createdOrder] = await tx
        .insert(orders)
        .values({
          buyerId: buyerProfileId,
          totalAmount: total.toString(),
          status: "pending",
          paymentStatus: "unpaid",
          shippingAddress,
          fulfillmentStatus: "not_shipped",
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        sellerItems.map((item) => ({
          orderId: createdOrder.id,
          productId: item.product.id,
          quantity: item.quantity,
          priceAtPurchase: item.product.price.toString(),
        }))
      );

      createdOrders.push({
        orderId: createdOrder.id,
        sellerId,
        itemCount: sellerItems.length,
      });
    }

    return createdOrders;
  });
}
