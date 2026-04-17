import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();


   const admin = await User.findOne({ role: "admin" }); if (!admin) { return NextResponse.json({ message: "u r not admin" }); }

    const { vendorID, status, rejectReason } = await req.json();
    console.log(vendorID , status , rejectReason);

    // ✅ GET VENDOR
    const vendor = await User.findById(vendorID);

    if (!vendor) {
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 }
      );
    }

    // ✅ STATUS LOGIC
    if (status === "approved") {
      vendor.verificationStatus = "approved";
      vendor.isApproved = true;
      vendor.rejectReason = "";
    }

    if (status === "reject") {
      vendor.verificationStatus = "reject";
      vendor.isApproved = false;
      vendor.rejectReason = rejectReason;
    }

    await vendor.save();

    return NextResponse.json(

               {vendor},
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
