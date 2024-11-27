"use client";

import KebabMenu from "@/components/KebabMenu/KebabMenu";
import PageHeading from "@/components/PageHeading/PageHeading";
import { useAuth } from "@clerk/nextjs";
import { IconTrash } from "@tabler/icons-react";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Gallery() {
  const { userId } = useAuth();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserImages = async () => {
      try {
        const response = await fetch("/api/retrieve", { method: "POST" });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch images:", errorText);
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [userId]);

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete image:", errorText);
        throw new Error("Failed to delete image");
      }

      // Update state to remove the deleted image
      setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("An error occurred while deleting the image.");
    }
  };

  if (!userId) {
    return <div>Please log in to view your images</div>;
  }

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (images.length === 0) {
    return (
      <div className="page-container">
        <PageHeading title="My Physique" />
        <p>Please complete a workout to upload a picture of your progress.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeading title="My Physique" />
      <div className="mt-[30px]">
        <ul className="flex flex-row flex-wrap gap-[10px] gallery">
          {images.map((image: any) => (
            <li key={image.id} className="flex flex-col gap-[10px] p-[10px] bg-[#fff] dark:bg-[#0c0c0c] rounded-[10px] gallery-item">
              <div className="gallery-image-wrapper relative">
                <a
                  href={image.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={image.imageUrl}
                    alt="Workout Image"
                    width={250}
                    height={250}
                    className="rounded-lg gallery-image"
                    unoptimized
                  />
                </a>
                <span className="absolute top-0 right-0 mt-[10px] mr-[10px] kebab-gallery">
                  <KebabMenu
                    header="Options"
                    width="auto"
                    footer={
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="flex gap-[10px] items-center bg-primary-800 px-[12px] py-[6px] text-white rounded delete-button"
                      >
                        <span className="text-[14px]">Delete</span>
                        <IconTrash size={16} className="w-[18px]" />
                      </button>
                    }
                  />
                </span>
              </div>
              <div className="px-[10px] workout-details">
                <p className="workout-date">
                  <span className="font-[500] text-[#222222] dark:text-[#cccccc]">Date: </span>
                  {format(new Date(image.uploadedAt), "MM/dd/yyyy HH:mm")}
                </p>
                <p className="current-weight">
                  <span className="font-[500] text-[#222222] dark:text-[#cccccc]">Weight: </span>
                  {image.currentWeight
                    ? `${image.currentWeight} kg`
                    : "No current weight"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
