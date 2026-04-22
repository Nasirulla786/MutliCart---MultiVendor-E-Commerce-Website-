import ConnectDb from "@/lib/db";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();
    const { productId, isActive } = await req.json();
    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive },
      { new: true },
    );

    return NextResponse.json({ updateProduct }, { status: 200 });
  } catch (error) {
    console.log("Edit shop details error", error);
    return NextResponse.json(
      { message: "Internal server erorr" },
      { status: 500 },
    );
  }
}
