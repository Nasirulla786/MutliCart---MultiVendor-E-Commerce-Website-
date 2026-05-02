import ConnectDb from "@/lib/db";
import orderModel from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  await ConnectDb();

  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { message: "No signature" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.log("Webhook Error:", err.message);
    return NextResponse.json(
      { message: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // ✅ HANDLE EVENT
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;

    if (orderId) {
      await orderModel.findByIdAndUpdate(orderId, {
        isPaid: true,
        
      });
    }
  }

  return NextResponse.json({ received: true });
}
