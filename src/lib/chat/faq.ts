export const GREEN_MARKET_FAQ = `
Green Market is a Ghana-focused marketplace connecting buyers, farmers and agricultural experts.

- Buyers can browse products, add available stock to their cart, pay securely with Paystack, track orders, message sellers, and review fulfilled purchases.
- Sellers can publish products, manage stock and fulfilment, view analytics, message buyers, and request expert consultations.
- Experts publish consultation services. After accepting a request, the expert schedules it and supplies a secure Google Meet, Zoom, or other HTTPS meeting link.
- Online marketplace payments use Paystack and can support cards or Mobile Money depending on Paystack availability. An order is paid only after server verification.
- Delivery is arranged using the shipping address on the order. Sellers can mark orders shipped or delivered and add a tracking reference.
- Users can edit their role-specific profile from their dashboard and use Messages for conversations with people.
- The assistant is separate from human Messages. For account-specific or payment disputes, contact the seller or platform administrator and do not share passwords, card numbers, PINs, or one-time codes.
`;

export function getFaqFallback(question: string, mode: "support" | "advisor") {
  const value = question.toLowerCase();

  if (mode === "advisor") {
    return "I can offer general Ghana-focused agricultural guidance, but the AI service is not configured right now. For advice specific to your crop, soil, pesticide use, or livestock, please book a verified expert from the Experts page.";
  }
  if (/pay|card|momo|mobile money/.test(value)) {
    return "Marketplace checkout uses Paystack. Your order is marked paid only after Green Market verifies the transaction. Never share a PIN or one-time code in chat.";
  }
  if (/deliver|ship|track/.test(value)) {
    return "Enter a complete shipping address at checkout. The seller can then update fulfilment to shipped or delivered and may add a tracking reference.";
  }
  if (/expert|consult|meeting/.test(value)) {
    return "Browse Experts, open a service, and send a consultation request. Once accepted, the expert schedules it and adds a meeting link you can open from your consultation page.";
  }
  if (/sell|product|stock/.test(value)) {
    return "Register as a seller, complete your profile, then use Seller Dashboard → Products to add listings and manage stock.";
  }
  if (/order|buy|cart/.test(value)) {
    return "Browse the Marketplace, add in-stock products to your cart, enter your shipping address, and pay with Paystack. You can follow the order from your buyer dashboard.";
  }
  return "I can help with ordering, payments, delivery, seller tools, and expert consultations. Ask a specific question, or use Messages when you need to speak with a seller or expert.";
}
