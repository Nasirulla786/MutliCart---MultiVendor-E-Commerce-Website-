import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import User from "@/model/user.model";
import Product, { IProduct } from "@/model/product.model";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({
      email: session.user?.email,
    }).select("-password");

    const { productId  , quantity } = await req.json();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 404 },
      );
    }

    const ExistProduct = user?.cart?.find((item:any)=> item.product.toString() === productId.toString() );
    if(ExistProduct){
        ExistProduct.quantity =   ExistProduct.quantity + quantity
    }
    else{
     user.cart.push({product:productId , quantity})



    }

    await user.save();
    return NextResponse.json({message:"add succcessfully"})


  } catch (error) {
    console.log("add to cart api error", error);
    return NextResponse.json(
      { message: "Internal server erorr" },
      { status: 500 },
    );
  }
}
