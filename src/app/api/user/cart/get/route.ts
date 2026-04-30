import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
// import { auth } from "../../../../../../auth";
import User from "@/model/user.model";
import Product, { IProduct } from "@/model/product.model";
import { auth } from "../../../../../../auth";
import ProductApproved from "@/app/(entities)/admin/admin-components/ProductRequest";

export async function GET() {
  try {
    await ConnectDb();
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({
      email: session.user?.email,
    }).select("-password").populate("cart.product");



    return NextResponse.json({
      cart: user.cart, // ✅ correct data
    });
  } catch (error) {
    console.log("add to cart api error", error);
    return NextResponse.json(
      { message: "Internal server erorr" },
      { status: 500 },
    );
  }
}
