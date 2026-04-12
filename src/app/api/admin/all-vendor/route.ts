import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";
import ConnectDb from "@/lib/db";

export async function GET() {
  try {
    await ConnectDb();
    const allVendors = await User.find({ role: "vendor" }).select("-password").sort({createdAt:-1});
    if (!allVendors) {
      return NextResponse.json(
        { message: "vendors not found" },
        { status: 3400 },
      );
    }

    return NextResponse.json({ allVendors }, { status: 200 });
  } catch (error) {
    console.log("fetch all vendor", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
}
