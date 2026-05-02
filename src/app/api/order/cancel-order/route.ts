import ConnectDb from "@/lib/db";
import orderModel from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();

    const { orderID } = await req.json();
    // console.log("this is irde", orderID)


    if (!orderID) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }


    const order = await orderModel.findById(orderID); // find ho rhaa hai


    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }


    if (order.orderStatus === "delivered") {
      return NextResponse.json(
        { message: "Delivered order cannot be cancelled" },
        { status: 400 }
      );
    }


    if (order.orderStatus === "cancelled") {
        console.log("thi sis order",order.orderStatus);
      return NextResponse.json(
        { message: "Order already cancelled" },
        { status: 400 }
      );
    }


    order.orderStatus = "cancelled";
    order.cancelAt = new Date();

    await order.save();

    return NextResponse.json({
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.log("Cancel Order Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
