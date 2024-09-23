"use client";

import PageHeading from "@/components/PageHeading/PageHeading";
import { useAuth } from "@clerk/nextjs";
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
        const response = await fetch(`/api/retrieve?userId=${userId}`);
        console.log("Response status:", response.status); // Log status code
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        console.log("Fetched images:", data); // Log data
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
            <a href={image.imageUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src={image.imageUrl}
                alt="Workout Image"
                width={250}
                height={250}
                className="rounded-lg gallery-image"
                unoptimized
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}