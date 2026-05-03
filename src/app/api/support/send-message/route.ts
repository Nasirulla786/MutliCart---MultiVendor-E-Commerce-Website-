import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();

    const { recId, message } = await req.json();
    const session = await auth();
    const senId = session?.user?.id;

    if (!senId || !recId || !message) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const senderId = new mongoose.Types.ObjectId(senId);
    const receiverId = new mongoose.Types.ObjectId(recId);

    const newMessage = {
      sender: senderId,
      text: message,
      createdAt: new Date(),
    };

    // =========================
    // ✅ SENDER SIDE
    // =========================

    const senderHasChat = await User.findOne({
      _id: senderId,
      "chats.with": receiverId,
    });

    if (senderHasChat) {
      // 👉 existing chat → push message
      await User.updateOne(
        { _id: senderId, "chats.with": receiverId },
        {
          $push: {
            "chats.$.message": newMessage,
          },
        }
      );
    } else {
      // 👉 new chat create
      await User.updateOne(
        { _id: senderId },
        {
          $push: {
            chats: {
              with: receiverId,
              message: [newMessage],
            },
          },
        }
      );
    }

    // =========================
    // ✅ RECEIVER SIDE (reverse logic)
    // =========================

    const receiverHasChat = await User.findOne({
      _id: receiverId,
      "chats.with": senderId,
    });

    if (receiverHasChat) {
      await User.updateOne(
        { _id: receiverId, "chats.with": senderId },
        {
          $push: {
            "chats.$.message": newMessage,
          },
        }
      );
    } else {
      await User.updateOne(
        { _id: receiverId },
        {
          $push: {
            chats: {
              with: senderId,
              message: [newMessage],
            },
          },
        }
      );
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.log("Chat support Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
