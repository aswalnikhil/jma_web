import { CheckoutError, verifyPaymentSignature } from "@/lib/server/razorpay";

// Confirms a payment reported by Razorpay Checkout really came from Razorpay,
// by checking its HMAC signature with the key secret.
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const orderId = typeof body?.orderId === "string" ? body.orderId : "";
    const paymentId = typeof body?.paymentId === "string" ? body.paymentId : "";
    const signature = typeof body?.signature === "string" ? body.signature : "";
    if (!orderId || !paymentId || !signature) throw new CheckoutError("Invalid payment confirmation.");

    if (!verifyPaymentSignature(orderId, paymentId, signature)) {
      console.error("Razorpay signature mismatch", { orderId, paymentId });
      throw new CheckoutError("We couldn't verify this payment. If money was deducted, please contact us with your payment ID.", 400);
    }

    return Response.json({ ok: true, orderId, paymentId });
  } catch (err) {
    if (err instanceof CheckoutError) return Response.json({ error: err.message }, { status: err.status });
    console.error("Verify error", err);
    return Response.json({ error: "Something went wrong verifying the payment." }, { status: 500 });
  }
}
