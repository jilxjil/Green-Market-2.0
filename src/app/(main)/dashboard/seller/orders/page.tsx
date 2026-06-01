import OrderStatusForm from "@/components/orders/order-status-form";
import { getSellerOrders } from "@/lib/orders";
import { requireRole } from "@/lib/auth/require-role";

export default async function SellerOrdersPage() {
  const { user } = await requireRole("seller");
  const sellerOrders = await getSellerOrders(user.id);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Track and update orders that contain your products.
        </p>
      </div>

      {sellerOrders.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No seller orders yet.
        </div>
      ) : (
        <div className="space-y-5">
          {sellerOrders.map((order) => (
            <article key={order.id} className="rounded-lg border bg-card p-5">
              <div className="grid gap-4 border-b pb-4 md:grid-cols-[minmax(0,1fr)_220px]">
                <div>
                  <h2 className="text-lg font-semibold">
                    Order {order.id.slice(0, 8)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Buyer {order.buyerUserId.slice(0, 8)} ·{" "}
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2 md:text-right">
                  <span className="inline-flex rounded-full bg-muted px-3 py-1 text-sm font-medium capitalize">
                    {order.status}
                  </span>
                  <p className="text-lg font-bold">GH₵ {order.totalAmount}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.productTitle}</p>
                      <p className="text-muted-foreground">
                        Qty {item.quantity} · GH₵ {item.priceAtPurchase} each
                      </p>
                    </div>
                    <p className="font-semibold">
                      GH₵ {Number(item.priceAtPurchase) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t pt-4">
                <OrderStatusForm orderId={order.id} status={order.status} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
