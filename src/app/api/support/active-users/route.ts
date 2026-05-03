import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";
import orderModel, { IOrder } from "@/model/order.model";

export async function GET() {
  try {
    await ConnectDb();
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session?.user?.id);
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 401 });
    }

    if (user?.role == "user") {
      const order = await orderModel
        .find({ buyer: user?.id })
        .populate("productVendor", "name shopName role image");

      const vendorMap = new Map<string, any>();
      order.forEach((order: IOrder) => {
        if (order.productVendor) {
          vendorMap.set(
            String(order?.productVendor?._id),
            order?.productVendor,
          );
        }
      });

      return NextResponse.json([...vendorMap.values()]);
    }

    if (user?.role == "vendor") {
      const order = await orderModel
        .find({ productVendor: user?.id })
        .populate("buyer", "name image role");

      const buyerMap = new Map<string, any>();
      order.forEach((order: IOrder) => {
        if (order.buyer) {
          buyerMap.set(String(order?.buyer?._id), order?.buyer);
        }
      });

      const admin = await User.find({ role: "admin" }).select(
        "name image role",
      );

      return NextResponse.json([admin, ...buyerMap.values()]);
    }

    if(user?.role=="admin"){
        const vendors = await User.find({role:"vendor"}).select("shopName name image role")

              return NextResponse.json([...vendors]);
    }
  } catch (error) {
    console.log("Chat support Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
