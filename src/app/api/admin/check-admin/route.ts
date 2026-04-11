import ConnectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ConnectDb();
        const isAdmin = await User.findOne({ role: { $regex: /^admin$/i } });
        return NextResponse.json({
            exist: !!isAdmin
        })



    } catch (error) {
        console.log("Check admin error", error);
        return NextResponse.json(
            { exist: false, error: "Server error" },
            { status: 500 }
          );

    }

}
