import ConnectDb from "@/lib/db";
import Product from "@/model/product.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await ConnectDb();
        const products = await Product.find({}).populate("vendor" ,"name email shopname").sort({createdAt:-1});
        

        return NextResponse.json({products});



    } catch (error) {
        console.log("Edit shop details error", error);
        return NextResponse.json(
            { message: "Internal server erorr" },
            { status: 500 }
        )

    }
}
