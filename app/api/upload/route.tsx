import prisma from "@/prisma/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const currentWeight = form.get("currentWeight") as string;

    if (!file || !currentWeight) {
      return NextResponse.json(
        { error: "File or current weight missing" },
        { status: 400 }
      );
    }

    // Validate file type
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image file." },
        { status: 400 }
      );
    }

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Convert currentWeight to a number
    const weight = parseFloat(currentWeight);
    if (isNaN(weight)) {
      return NextResponse.json(
        { error: "Invalid weight value" },
        { status: 400 }
      );
    }

    const blob = await put(file.name, file, { access: "public" });

    // Save the image and weight into the WorkoutImage table
    const savedImage = await prisma.workoutImage.create({
      data: {
        imageUrl: blob.url,
        userId: userId,
        currentWeight: weight,
      },
    });

    // Check if the user exists in the UserInfo table
    let userExists = await prisma.userInfo.findUnique({
      where: { userId: userId },
    });

    // If the user doesn't exist, create a new UserInfo record
    if (!userExists) {
      userExists = await prisma.userInfo.create({
        data: {
          userId: userId,
          weight: weight, // Set initial weight or any other default values
        },
      });
    }

    // Save the currentWeight to the UserWeight table
    const savedWeight = await prisma.userWeight.create({
      data: {
        userId: userExists.userId, // Use the existing user's userId
        weight: weight,
      },
    });

    return NextResponse.json({
      savedImage,
      savedWeight,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in upload route:", error.message);
      return NextResponse.json(
        { error: "Error processing request", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

