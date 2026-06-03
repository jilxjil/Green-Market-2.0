import type { PublicExpertService } from "@/lib/expert-services";

const serviceImageRules = [
  {
    keywords: ["disease", "pest", "diagnosis", "pepper"],
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d",
  },
  {
    keywords: ["soil", "fertility", "nutrition", "fertilizer", "compost"],
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
  },
  {
    keywords: ["irrigation", "water", "dry season"],
    imageUrl:
      "https://images.pexels.com/photos/2173176/pexels-photo-2173176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    keywords: ["livestock", "poultry", "goat", "veterinary", "health"],
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1663013018100-6dbcf6aaddd6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    keywords: ["storage", "post-harvest", "handling", "loss"],
    imageUrl:
      "https://images.pexels.com/photos/6170400/pexels-photo-6170400.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    keywords: ["business", "market", "access", "management"],
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
  },
  {
    keywords: ["logistics", "distribution", "delivery", "supply"],
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
  },
  {
    keywords: ["training", "workshop", "certification"],
    imageUrl: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17",
  },
];

export function getExpertServiceImage(service: PublicExpertService) {
  const haystack =
    `${service.title} ${service.description ?? ""} ${service.expertise ?? ""}`.toLowerCase();
  const match = serviceImageRules.find((rule) =>
    rule.keywords.some((keyword) => haystack.includes(keyword))
  );

  return (
    match?.imageUrl ??
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854"
  );
}
