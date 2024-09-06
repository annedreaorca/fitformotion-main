import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import prisma from "@/prisma/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        // Parse form data
        const form = await req.formData();
        const file = form.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Get authenticated user's ID
        const { userId } = getAuth(req);
        console.log("Authenticated user ID:", userId); // Log the user ID

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Upload file to blob storage
        const blob = await put(file.name, file, { access: "public" });
        console.log("Uploaded blob:", blob); // Log the blob URL

        // Save image data to database
        const savedImage = await prisma.workoutImage.create({
            data: {
                imageUrl: blob.url,
                userId: userId, // Associate the image with the authenticated user
            },
        });

        return NextResponse.json(savedImage);
    } catch (error) {
        console.error("Error in upload route:", error); // Log the error
        return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    }
}
