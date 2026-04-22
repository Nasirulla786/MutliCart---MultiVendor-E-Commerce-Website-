import { NextRequest, NextResponse } from "next/server";
import uploadOnCloudinary from "@/lib/cloudinary";
import Product from "@/model/product.model";
import ConnectDb from "@/lib/db";
import { auth } from "../../../../../../auth";
// import { auth } from "../../../../../auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  try {
    await ConnectDb();

    // ── Vendor Auth ──
    const session = await auth();
    const vendorId = session?.user?.id;
    if (!vendorId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const para = await params

    const productId = para.id

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Optional: check ownership
    if (existingProduct.vendor.toString() !== vendorId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();

    // ── Fields ──
    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const stock = Number(formData.get("stock")) || 0;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    const isWearble = formData.get("isWearable") === "true";
    const sizes = JSON.parse((formData.get("sizes") as string) || "[]");
    const replacmentDays = Number(formData.get("replacementDays")) || 0;
    const warenty = formData.get("warranty") as string;
    const freeDelivery = formData.get("freeDelivery") === "true";
    const payOnDelivery = formData.get("cod") === "true";
    const detailPoints = JSON.parse((formData.get("points") as string) || "[]");

    // ── Images ──
    const image1File = formData.get("image1") as Blob | null;
    const image2File = formData.get("image2") as Blob | null;
    const image3File = formData.get("image3") as Blob | null;
    const image4File = formData.get("image4") as Blob | null;

    let image1 = existingProduct.image1;
    let image2 = existingProduct.image2;
    let image3 = existingProduct.image3;
    let image4 = existingProduct.image4;

    if (image1File) image1 = await uploadOnCloudinary(image1File);
    if (image2File) image2 = await uploadOnCloudinary(image2File);
    if (image3File) image3 = await uploadOnCloudinary(image3File);
    if (image4File) image4 = await uploadOnCloudinary(image4File);

    // ── Update ──
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
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
        verificationStatus: "pending", // re-verify after update
        isActive: false,
        requestAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Product updated successfully!", product: updatedProduct },
      { status: 200 }
    );

  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
