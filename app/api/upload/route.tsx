import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob"; // Ensure this library is correctly installed and imported
import prisma from "@/prisma/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        // Parse form data
        const form = await req.formData();
        const file = form.get("file") as File; // Expecting a file object
        const workoutName = form.get("workoutName") as string;  // Get workout name

        // Check if file and workoutName are provided
        if (!file || !workoutName) {
            return NextResponse.json({ error: "File or workout name missing" }, { status: 400 });
        }

        // Get authenticated user's ID
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Upload file to blob storage
        const blob = await put(file.name, file, { access: "public" });

        // Save image data to database, including workoutName
        const savedImage = await prisma.workoutImage.create({
            data: {
                imageUrl: blob.url,
                userId: userId,
                workoutName: workoutName,  // Save workout name
            },
        });

        return NextResponse.json(savedImage); // Respond with saved image data
    } catch (error) {
        console.error("Error in upload route:", error);
        return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    }
}
