import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { FaBalanceScale, FaCheck, FaSeedling, FaShoePrints } from "react-icons/fa";

import MarketplaceFilters from "@/components/marketplace/marketplace-filters";
import { getMarketplaceCategories, getPublicProducts } from "@/lib/products";
import { formatProductAvailability, formatProductPrice } from "@/lib/product-units";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [allProducts, categories] = await Promise.all([
    getPublicProducts({ q: params.q, category: params.category }),
    getMarketplaceCategories(),
  ]);

  return (
    <main className="mt-3 overflow-hidden">
      <div className="bg-[url('/landscapeView.jpeg')] bg-cover bg-center max-w-7xl md:px-6 lg:max-w-full px-4 pb-9 lg:flex lg:px-8 flex flex-col mt-auto min-sm:[h-65]">
        <div className="hidden md:block mx-auto max-w-3xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8 space-y-2">
          <h1 className="mt-10 text-6xl font-semibold tracking-tight font-alan text-primary-foreground">
            Green Market
          </h1>
          <p className="text-lg text-primary-foreground">
            Find all your farm produce for your long-term use
          </p>
          <span className="hidden md:flex w-full h-6" />
          <Button className="bg-green-accent/20 font-alan text-background hover:bg-green-accent/50 border-green-accent/80 p-5 px-12">
            Discover More
          </Button>
        </div>

        <div className="mt-auto h-45 md:hidden flex flex-col justify-end">
          <h1 className="mb-2 text-6xl font-medium tracking-tight font-alan text-primary-foreground">
            Green Market
          </h1>
          <p className="text-lg text-primary-foreground font-light mb-6">
            Find all your farm produce for your long-term use
          </p>
          <Button className="bg-green-accent/20 font-normal font-alan text-background hover:bg-green-accent/50 border-green-accent p-5">
            DISCOVER MORE
          </Button>
        </div>
      </div>

      <div className="bg-green-accent/20 px-3 md:px-6 lg:px-8 flex flex-col md:flex-row items-center py-8 md:py-0 md:min-h-[260px] w-full">
        <div className="flex px-6 flex-col gap-4">
          <h1 className="text-3xl font-semibold font-alan mb-2">The Green Market Standard</h1>
          <p className="text-lg text-zinc-600">Connecting farmers, buyers, and experts</p>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 items-center justify-items-center py-6 md:py-0">
          {[
            { icon: FaBalanceScale, title: "Fair Trade", copy: "Direct farmer-to-buyer pricing" },
            { icon: FaCheck, title: "Verified Farmers", copy: "Trusted agricultural sellers" },
            { icon: FaShoePrints, title: "Traceable Produce", copy: "Visibility from source to buyer" },
            { icon: FaSeedling, title: "Sustainable Growth", copy: "Supporting local agriculture and food systems" },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <div className="flex justify-center items-center rounded-full w-16 h-16 bg-accent">
                <Icon size="1.5em" />
              </div>
              <h2 className="text-base text-center font-semibold font-alan">{title}</h2>
              <p className="text-xs text-center text-zinc-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Fresh from the marketplace</h2>
            <p className="text-muted-foreground">
              Browse produce listed by Green Market sellers.
              {params.q ? ` Results for "${params.q}".` : ""}
            </p>
          </div>
          <Suspense fallback={null}>
            <MarketplaceFilters categories={categories} />
          </Suspense>
        </div>

        {allProducts.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No products match your search.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allProducts.map((product) => (
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
                    <h3 className="font-semibold text-foreground">{product.title}</h3>
                    <p className="shrink-0 text-right font-bold">
                      {formatProductPrice(product.price, product.unitOfMeasure)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {product.category || "Fresh produce"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.status === "out_of_stock" || (product.stockQuantity ?? 0) <= 0
                      ? "Out of stock"
                      : formatProductAvailability(product.stockQuantity, product.unitOfMeasure)}
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
