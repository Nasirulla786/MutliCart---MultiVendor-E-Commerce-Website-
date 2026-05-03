import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";

export async function GET(req: NextRequest) {
  try {
    await ConnectDb();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }


    const user = await User.findById(userId).select("chats");

    return NextResponse.json(
      { chats: user?.chats || [] },
      { status: 200 }
    );

  } catch (error) {
    console.log("Get all chats error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
