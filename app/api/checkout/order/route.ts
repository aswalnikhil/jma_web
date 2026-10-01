import { CheckoutError, createRazorpayOrder, priceCart, validateCustomer } from "@/lib/server/razorpay";
import type { OrderResponse } from "@/lib/checkout";

// Creates a Razorpay order for the shopper's cart. Prices are recomputed here
// from the product catalogue; prices sent by the browser are ignored.
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { items?: unknown; customer?: unknown } | null;
    if (!body) throw new CheckoutError("Invalid request.");

    const customer = validateCustomer(body.customer);
    const { lines, total } = priceCart(body.items);
    if (total <= 0) throw new CheckoutError("Your cart is empty.");

    const { order, keyId } = await createRazorpayOrder(total * 100, customer, lines);

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    } satisfies OrderResponse);
  } catch (err) {
    return errorResponse(err);
  }
}

function errorResponse(err: unknown) {
  if (err instanceof CheckoutError) return Response.json({ error: err.message }, { status: err.status });
  console.error("Checkout error", err);
  return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
