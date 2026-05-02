    import { NextRequest, NextResponse } from "next/server";
    import { auth } from "../../../../../auth";
    import ConnectDb from "@/lib/db";
    import orderModel from "@/model/order.model";

    export async function GET() {
    try {
        await ConnectDb();

        const session = await auth();
        if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const orders = await orderModel
        .find({})
        .populate("buyer", "name email image phone")
        .populate("productVendor", "name shopName email").populate("products.product")
        .sort({ createdAt: -1 });


        return NextResponse.json({orders})


    } catch (error) {
        console.log("get all Order API error", error);

        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
        );
    }
    }
