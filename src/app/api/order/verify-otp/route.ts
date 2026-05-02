import ConnectDb from "@/lib/db";
import orderModel from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();

    const { orderId, otp } = await req.json();


    // ✅ validation
    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "OrderId and OTP required" },
        { status: 400 }
      );
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ check OTP existence
    if (!order.deliveryOTP || !order.OTPExpires) {
      return NextResponse.json(
        { message: "No OTP found for this order" },
        { status: 400 }
      );
    }

    // ✅ expiry check
    if (order.OTPExpires < new Date()) {
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    // ✅ OTP match
    if (order.deliveryOTP !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // ✅ SUCCESS → mark delivered
    order.orderStatus = "delivered";
    order.isPaid = true;

    // clear OTP
    order.deliveryOTP = undefined;
    order.OTPExpires = undefined;

    await order.save();

    return NextResponse.json({
      message: "Order delivered successfully",
      order,
    });

  } catch (error) {
    console.log("Verify OTP error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
