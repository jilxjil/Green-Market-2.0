


import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { FaBalanceScale, FaShoePrints, FaSeedling,FaCheck } from "react-icons/fa";

import { products } from "@/db/schema";


export default async function BuyerDashboard() {

  const allProducts = await db.select().from(products);




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
  <section>
    {allProducts.map((product) => (
      <div key={product.id}>
        <h2>{product.title}</h2>
        <p>{product.price}</p>
      </div>
    ))}
  </section>
  

      

     
    </div>
   </main>
  );
}

