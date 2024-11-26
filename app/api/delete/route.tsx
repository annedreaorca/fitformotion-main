import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json(); 
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    // Delete the image record from the database
    await prisma.workoutImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
