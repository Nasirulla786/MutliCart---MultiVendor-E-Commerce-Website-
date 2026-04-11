import ConnectDb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";

export async function GET() {
    try {
        await ConnectDb();
        const session = await auth();
        const user = await User.findOne({ email: session?.user?.email }).select("-password");

        return NextResponse.json(
            { user },
            { status: 200 }
        )



    } catch (error) {
        console.log("Curreent user api error", error);
        return NextResponse.json(
            { message: "Internal server erorr" },
            { status: 500 }
        )

    }
}
