import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";

export async function POST(req: NextRequest) {
    try {
        await ConnectDb();
        const { shopName, shopAddress, gstNumber } = await req.json();
        const session = await auth();
        const user = await User.findOneAndUpdate({ email: session?.user?.email }, { shopName, shopAddress, gstNumber, verificationStatus: "pending", requestAt: new Date() }, { new: true });


        if(!user){
            throw new Error("Vendor not found");
        }

        return NextResponse.json(
            {data:user},
            {status:200}
        )

    } catch (error) {
        console.log("Edit shop details error", error);
        return NextResponse.json(
            { message: "Internal server erorr" },
            { status: 500 }
        )

    }


}
