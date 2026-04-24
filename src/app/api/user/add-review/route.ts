import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";
import Product from "@/model/product.model";
import uploadOnCloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        await ConnectDb();

        const session = await auth();

        // ✅ Auth check
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findOne({
            email: session.user?.email
        }).select("-password");

        const formData = await req.formData();

        const image = formData.get("image") as File | null;
        const productId = formData.get("id") as string;
        const comment = formData.get("comment") as string;
        const rating = Number(formData.get("rating"));

        // ✅ Product check
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { message: "Product Not Found" },
                { status: 404 }
            );
        }

        let imageUpload ="" as string  | null;

        if (image) {
            imageUpload = await uploadOnCloudinary(image);
        }

        // ✅ Push review
        product.reviews.push({
            user: user?._id,
            rating,
            comment,
            image: imageUpload,
        });

        await product.save();

        return NextResponse.json({
            message: "Review added successfully",
            product,
        });

    } catch (error) {
        console.log("Review API error", error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
