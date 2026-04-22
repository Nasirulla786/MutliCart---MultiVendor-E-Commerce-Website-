import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";
import Product from "@/model/product.model";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();


   const admin = await User.findOne({ role: "admin" });
    if (!admin) { return NextResponse.json({ message: "u r not admin" }); }

    const { productID, status, rejectReason } = await req.json();



    const product = await Product.findById(productID);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }


    if (status === "approve") {
      product.verificationStatus = "approve";
      product.isApproved = true;
      product.rejectReason = "";
    }

    if (status === "reject") {
      product.verificationStatus = "reject";
      product.isApproved = false;
      product.rejectReason = rejectReason;
    }

    await product.save();

    return NextResponse.json(

               {product},
      { status: 200 },

    );

  } catch (error) {
    console.log("Verification Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
