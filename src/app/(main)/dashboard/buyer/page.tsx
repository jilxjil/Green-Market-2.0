import Link from "next/link";

import CancelOrderButton from "@/components/orders/cancel-order-button";
import { Button } from "@/components/ui/button";
import { getRequesterConsultationRequests } from "@/lib/consultation-requests-db";
import { getBuyerOrders } from "@/lib/orders";
import { requireRole } from "@/lib/auth/require-role";
import { formatProductPrice, getProductUnitLabel } from "@/lib/product-units";

export default async function BuyerDashboard() {
  const { user, profile } = await requireRole("buyer");
  const [buyerOrders, consultationRequests] = await Promise.all([
    getBuyerOrders(profile.id),
    getRequesterConsultationRequests(user.id),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h1>
          <p className="text-muted-foreground">
            Track orders and consultation requests from Green Market.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/experts">Browse experts</Link>
          </Button>
          <Button asChild>
            <Link href="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
      </div>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Orders</h2>
        {buyerOrders.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <h3 className="text-xl font-semibold">No orders yet</h3>
            <p className="mt-2 text-muted-foreground">
              Your order history will appear here after checkout.
            </p>
          </div>
        ) : (
          buyerOrders.map((order) => (
            <article key={order.id} className="rounded-lg border bg-card p-5">
              <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold">Order {order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.createdAt.toLocaleDateString()} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium capitalize">
                    {order.status}
                  </span>
                  <p className="mt-2 text-lg font-bold">GH₵ {order.totalAmount}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <Link
                        href={`/marketplace/${item.productId}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.productTitle}
                      </Link>
                      <p className="text-muted-foreground">
                        Qty {item.quantity} {getProductUnitLabel(item.productUnitOfMeasure)} ·{" "}
                        {formatProductPrice(item.priceAtPurchase, item.productUnitOfMeasure)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      GH₵ {Number(item.priceAtPurchase) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t pt-4">
                <div className="mb-4 rounded-lg bg-muted/50 p-3 text-sm">
                  <p className="font-medium">Delivery status</p>
                  <p className="mt-1 capitalize text-muted-foreground">
                    {order.fulfillmentStatus.replace("_", " ")}
                    {order.trackingNumber ? ` · Tracking: ${order.trackingNumber}` : ""}
                  </p>
                  {order.shippingAddress && (
                    <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                      {order.shippingAddress}
                    </p>
                  )}
                </div>
                <CancelOrderButton orderId={order.id} status={order.status} />
              </div>
            </article>
          ))
        )}
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Consultation requests</h2>
        {consultationRequests.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <h3 className="text-xl font-semibold">No consultation requests yet</h3>
            <p className="mt-2 text-muted-foreground">
              Browse expert services to request agricultural advice.
            </p>
          </div>
        ) : (
          consultationRequests.map(({ request, service }) => (
            <article key={request.id} className="rounded-lg border bg-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    href={`/experts/${service.id}`}
                    className="text-lg font-semibold hover:text-primary"
                  >
                    {service.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {request.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-sm font-medium capitalize">
                  {request.status}
                </span>
              </div>
              {request.message && (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {request.message}
                </p>
              )}
              {request.scheduledFor && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Scheduled for {request.scheduledFor.toLocaleString()}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link href={`/consultations/${request.id}`}>View details</Link>
                </Button>
                {request.status === "scheduled" && request.meetingUrl && (
                  <Button asChild>
                    <a
                      href={request.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join consultation
                    </a>
                  </Button>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
