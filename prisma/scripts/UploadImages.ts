import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveImageUrl(url: string) {
  try {
    await prisma.image.create({
      data: { url },
    });
  } catch (error) {
    console.error("Error saving image URL:", error);
    throw new Error("Failed to save image URL");
  }
}

export async function getImageUrls() {
  try {
    return await prisma.image.findMany({
      select: { url: true },
    });
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    throw new Error("Failed to fetch image URLs");
  }
}
