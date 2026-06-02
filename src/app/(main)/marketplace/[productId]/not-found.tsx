import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold">Product Not Found</h2>
      <p className="mt-2 text-muted-foreground">The product you are looking for does not exist or has been archived.</p>
      <Button asChild className="mt-6">
        <Link href="/marketplace">Return to Marketplace</Link>
      </Button>
    </div>
  );
}
