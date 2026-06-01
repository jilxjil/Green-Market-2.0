import Link from "next/link";
import { notFound } from "next/navigation";

import { getSellerStorefront } from "@/lib/sellers";

export default async function SellerStorefrontPage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const { sellerId } = await params;
  const data = await getSellerStorefront(sellerId);

  if (!data) {
    notFound();
  }

  const sellerLabel = data.seller.farmName || data.seller.name;

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6 lg:px-8">
      <header className="space-y-3 rounded-lg border bg-card p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{sellerLabel}</h1>
            {data.seller.location && (
              <p className="mt-1 text-muted-foreground">{data.seller.location}</p>
            )}
          </div>

          {data.seller.verificationStatus && (
            <span className="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-sm font-medium capitalize">
              {data.seller.verificationStatus}
            </span>
          )}
        </div>
      </header>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Products</h2>

        {data.products.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No active products from this seller yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.products.map((product) => (
              <Link
                key={product.id}
                href={`/marketplace/${product.id}`}
                className="group overflow-hidden rounded-lg border bg-card transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-green-accent/30 text-lg font-semibold text-primary">
                    Green Market
                  </div>
                )}

                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-foreground">
                      {product.title}
                    </h3>
                    <p className="shrink-0 font-bold">GH₵ {product.price}</p>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {product.category || "Fresh produce"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.stockQuantity ?? 0} available
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

