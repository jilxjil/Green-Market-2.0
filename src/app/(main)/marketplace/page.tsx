
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { FaBalanceScale, FaShoePrints, FaSeedling,FaCheck } from "react-icons/fa";

import { products } from "@/db/schema";
import { desc } from "drizzle-orm";


export default async function BuyerDashboard() {

  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));




  return (
   <main className=" overflow-hidden  mt-3 ">
    <div className="bg-[url('/landscapeView.jpeg')] bg-cover bg-center  max-w-7xl md:px-6 lg:max-w-full px-4 pb-9  lg:flex lg:px-8 flex flex-col mt-auto min-sm:[h-65]">
    {/* For desktop view */}
      <div className="hidden md:block mx-auto max-w-3xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8 space-y-2">
        <h1 className="mt-10 text-6xl font-semibold tracking-tight font-alan text-primary-foreground">Green Market</h1>
        <p className="text-lg text-primary-foreground">
          Find all your farm produce for your long-term use
        </p>
        <span className="hidden md:flex w-full h-6"/>
        <Button className=" bg-green-accent/20   font-alan text-background hover:bg-green-accent/50 border-green-accent/80 p-5 px-12">Discover More</Button>
      </div>

      {/* For mobile view */}
      <div className="mt-auto h-45 md:hidden flex flex-col justify-end ">
        <h1 className="mb-2 text-6xl font-medium tracking-tight font-alan text-primary-foreground">Green Market</h1>
        <p className="text-lg text-primary-foreground font-light mb-6">
          Find all your farm produce for your long-term use
        </p>
     
        <Button className=" bg-green-accent/20 font-normal  font-alan text-background hover:bg-green-accent/50 border-green-accent p-5 ">DISCOVER MORE</Button>
      </div>

    </div>
 <div className="bg-green-accent/20 px-3 md:px-6 lg:px-8 flex flex-col md:flex-row items-center py-8 md:py-0 md:min-h-[260px] w-full">
  
  {/* Left: Title block */}
  <div className="flex px-6 flex flex-col gap-4">
    <h1 className="text-3xl font-semibold font-alan mb-2">The Green Market Standard</h1>
    <p className="text-lg text-zinc-600">Connecting farmers, buyers, and experts</p>
  </div>

  {/* Right: 4-column icon grid */}
  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 items-center justify-items-center py-6 md:py-0">
    
    {/* 1 */}
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-center items-center rounded-full w-16 h-16 bg-accent">
        <FaBalanceScale size="1.5em" />
      </div>
      <h2 className="text-base text-center font-semibold font-alan">Fair Trade</h2>
      <p className="text-xs text-center text-zinc-600">Direct farmer-to-buyer pricing</p>
    </div>

    {/* 2 */}
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-center items-center rounded-full w-16 h-16 bg-accent">
        <FaCheck size="1.5em" />
      </div>
      <h2 className="text-base text-center font-semibold font-alan">Verified Farmers</h2>
      <p className="text-xs text-center text-zinc-600">Trusted agricultural sellers</p>
    </div>

    {/* 3 */}
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-center items-center rounded-full w-16 h-16 bg-accent">
        <FaShoePrints size="1.5em" />
      </div>
      <h2 className="text-base text-center font-semibold font-alan">Traceable Produce</h2>
      <p className="text-xs text-center text-zinc-600">Visibility from source to buyer</p>
    </div>

    {/* 4 */}
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-center items-center rounded-full w-16 h-16 bg-accent">
        <FaSeedling size="1.5em" />
      </div>
      <h2 className="text-base text-center font-semibold font-alan">Sustainable Growth</h2>
      <p className="text-xs text-center text-zinc-600">Supporting local agriculture and food systems</p>
    </div>

  </div>
    </div>

    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Fresh from the marketplace
          </h2>
          <p className="text-muted-foreground">
            Browse produce listed by Green Market sellers.
          </p>
        </div>
      </div>

      {allProducts.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No products are listed yet.
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
                  <h3 className="font-semibold text-foreground">
                    {product.title}
                  </h3>
                  <p className="shrink-0 font-bold">
                    GH₵ {product.price}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.category || "Fresh produce"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(product.stockQuantity ?? 0) > 0
                    ? `${product.stockQuantity} available`
                    : "Out of stock"}
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
