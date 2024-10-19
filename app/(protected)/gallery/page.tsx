"use client";

import PageHeading from "@/components/PageHeading/PageHeading";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns"; // Import date-fns

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

  if (!userId) {
    return <div>Please log in to view your images</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
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
      <ul className="flex flex-row flex-wrap gap-[10px] mt-[30px] gallery">
        {images.map((image: any) => (
          <li key={image.id} className="gallery-item">
            <div className="gallery-image-wrapper">
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
              <div className="workout-details">
                {/* Check if currentWeight exists */}
                <p className="current-weight">
                  {image.currentWeight
                    ? `${image.currentWeight} kg` // Add "kg" after the currentWeight
                    : "No current weight"}
                </p>
                <p className="workout-date">
                  {format(new Date(image.uploadedAt), "MM/dd/yyyy HH:mm")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
