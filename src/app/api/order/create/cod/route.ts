import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import User from "@/model/user.model";
import Product from "@/model/product.model";
import Order from "@/model/order.model";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();

    // ✅ AUTH CHECK
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }

    const userId = session.user?.id;

    // ✅ BODY DATA
    const {
      productId,
      quantity,
      address,
      deliveryCharge,
      serviceCharge,
    } = await req.json();

    // ✅ BASIC VALIDATION
    if (!address) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // ✅ FETCH USER
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const cartItem = user?.cart.find(
      (item: any) =>
        (item.product._id?.toString() || item.product.toString()) ===
        productId.toString(),
    );

    if (!cartItem) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 },
      );
    }





    // ✅ FETCH PRODUCT
    const product = await Product.findById(productId).populate("vendor" ,"name email  shopName shopAddress");
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // ✅ STOCK CHECK
    if (product.stock < quantity) {
      return NextResponse.json(
        { message: "Insufficient stock" },
        { status: 401 },
      );
    }

    // ✅ CALCULATIONS
    const productTotal = product.price * quantity;
    const totalAmount = productTotal + deliveryCharge + serviceCharge;

    // ✅ CREATE ORDER
    const order = await Order.create({
      buyer: userId,
      products: [
        {
          product: productId,
          quantity,
          price: product.price, // ✅ FIXED
        },
      ],
      productVendor: product.vendor,
      productTotal,
      deliveryCharge,
      serviceCharge,
      totalAmount,
      paymentMethod: "cod",
      orderStatus: "pending",
      returnAmount: 0,
      address,

    });

    // ✅ UPDATE STOCK
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: -quantity },
    });

    // ✅ REMOVE FROM CART
    user.cart = user.cart.filter(
      (item: any) =>
        (item.product._id?.toString() || item.product.toString()) !==
        productId.toString(),
    );

    // ✅ ADD ORDER TO USER
    user.orders.push(order._id);

    await user.save();

    // ✅ SUCCESS RESPONSE
    return NextResponse.json(
      {
        message: "Order placed successfully",
        orderId: order._id,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);



    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
