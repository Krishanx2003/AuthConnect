import User from "@/models/User";
import connect from "@/utils/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { firstName, lastName, email, password } = await request.json();

    await connect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    return new NextResponse("User is registered", { status: 200 });
  } catch (err:any) {
    return new NextResponse("Server error", {
      status: 500,
      statusText: err.message,
    });
  }
};
