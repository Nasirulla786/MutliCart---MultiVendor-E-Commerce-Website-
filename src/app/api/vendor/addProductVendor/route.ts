import { NextRequest, NextResponse } from "next/server";
import uploadOnCloudinary from "@/lib/cloudinary";
import Product from "@/model/product.model";
import ConnectDb from "@/lib/db";
import { auth } from "../../../../../auth";


export async function POST(req: NextRequest) {
  try {
    await ConnectDb();

    // ── Vendor ID (session se) ──
    const session = await auth();
    const vendorId = session?.user?.id;
    if (!vendorId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    // ── Text fields ──
    const title           = formData.get("title") as string;
    const price           = formData.get("price") as string;
    const stock           = Number(formData.get("stock")) || 0;
    const category        = formData.get("category") as string;
    const description     = formData.get("description") as string;
    const isWearble       = formData.get("isWearable") === "true";   // model mein isWearble hai
    const sizes           = JSON.parse(formData.get("sizes") as string || "[]");
    const replacmentDays  = Number(formData.get("replacementDays")) || 0; // model mein replacmentDays
    const warenty         = formData.get("warranty") as string;       // model mein warenty
    const freeDelivery    = formData.get("freeDelivery") === "true";
    const payOnDelivery   = formData.get("cod") === "true";           // model mein payOnDelivery
    const detailPoints    = JSON.parse(formData.get("points") as string || "[]"); // model mein detailPoints

    // ── Images upload to Cloudinary ──
    const image1File = formData.get("image1") as Blob | null;
    const image2File = formData.get("image2") as Blob | null;
    const image3File = formData.get("image3") as Blob | null;
    const image4File = formData.get("image4") as Blob | null;

    // image1 required hai model mein
    if (!image1File) {
      return NextResponse.json({ message: "At least 1 image is required" }, { status: 400 });
    }

    const image1 = await uploadOnCloudinary(image1File);
    const image2 = image2File ? await uploadOnCloudinary(image2File) : undefined;
    const image3 = image3File ? await uploadOnCloudinary(image3File) : undefined;
    const image4 = image4File ? await uploadOnCloudinary(image4File) : undefined;

    if (!image1) {
      return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
    }

    // ── Save to DB ──
    const product = await Product.create({
      title,
      price,
      stock,
      isStock: stock > 0,
      category,
      description,
      isWearble,
      sizes,
      replacmentDays,
      warenty,
      freeDelivery,
      payOnDelivery,
      detailPoints,
      image1,
      image2,
      image3,
      image4,
      vendor: vendorId,
      verificationStatus: "pending",
      isActive:false,
      requestAt: new Date(),
    });

    return NextResponse.json(
      { message: "Product added successfully!", product },
      { status: 201 }
    );

  } catch (error) {
    console.error("Add product error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
