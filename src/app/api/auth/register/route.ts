import ConnectDb from "@/lib/db";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {

    await ConnectDb();

    const { name, email, password } = await req.json();
    console.log("this is data", name, email, password);
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "required all fields" },
        { status: 400 },
      );
    }

    if (password.length < 5) {
      return NextResponse.json({
        message: "password  should be at least 5 characters"},
        {status: 400,
      });
    }

    const alreadyEmail = await User.findOne({ email });
    if (alreadyEmail) {
      return NextResponse.json({
        message: "Email already exists"},
        {status: 400,
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPass,
    });

    const response = NextResponse.json(

      {message: "User registred successfully.."},
      { status: 201},


    );


    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
    );

    response.cookies.set("token", token);
    return response
  } catch (error) {
    console.log("registration error", error);
    throw new Error("Registration error");
  }
}
