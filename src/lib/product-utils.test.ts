import { describe, expect, it } from "vitest";
import { isProductPurchasable, resolveProductStatus } from "./product-utils";

describe("product availability", () => {
  it("marks zero stock out of stock", () => expect(resolveProductStatus(0, "active")).toBe("out_of_stock"));
  it("preserves archived status", () => expect(resolveProductStatus(10, "archived")).toBe("archived"));
  it("allows only active stock to be purchased", () => {
    expect(isProductPurchasable({ status: "active", stockQuantity: 2 })).toBe(true);
    expect(isProductPurchasable({ status: "out_of_stock", stockQuantity: 2 })).toBe(false);
  });
});
