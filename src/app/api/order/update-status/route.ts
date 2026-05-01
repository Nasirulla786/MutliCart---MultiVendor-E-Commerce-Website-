import ConnectDb from "@/lib/db";
import { SendOTP } from "@/lib/nodemailer";
import orderModel from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "OrderId and status required" },
        { status: 400 }
      );
    }

    const order = await orderModel.findById(orderId).populate("buyer");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ SIMPLE STATUS UPDATE
    if (status === "confirmed" || status === "returned") {
      order.orderStatus = status;
      await order.save();

      return NextResponse.json({
        message: "Order status updated successfully",
        order,
      });
    }

    // ✅ DELIVERY OTP FLOW
    if (status === "delivered") {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      order.deliveryOTP = otp;
      order.OTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      order.orderStatus = "delivered";
      order.isPaid=true // 🔥 better flow

      await order.save();

      const email = order?.buyer?.email;

      if (!email) {
        return NextResponse.json(
          { message: "Buyer email not found" },
          { status: 400 }
        );
      }

      await SendOTP(email, otp);

      return NextResponse.json({
        message: "OTP sent to customer email",
      });
    }

    // ✅ OTHER STATUS (shipped, cancelled etc.)
    order.orderStatus = status;
    await order.save();

    return NextResponse.json({
      message: "Order status updated",
      order,
    });

  } catch (error) {
    console.log("Order update error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
