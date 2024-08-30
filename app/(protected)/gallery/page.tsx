"use client"; // This line ensures the component is rendered as a Client Component

import { useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading/PageHeading";

interface Image {
  url: string;
}

export default function Gallery() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImageUrls() {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Image[] = await response.json();
        setImageUrls(data.map((image) => image.url));
      } catch (error) {
        console.error("Failed to fetch image URLs", error);
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    }

    fetchImageUrls();
  }, []);

  return (
    <div className="page-container">
      <PageHeading title="Gallery" />
      {loading && <p>Loading images...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => (
            <div key={index} className="bg-gray-200 p-4 rounded">
              <img
                src={url}
                alt={`Image ${index}`} // Fixed alt attribute
                className="w-full h-auto rounded"
              />
            </div>
          ))
        ) : (
          <p>No images found</p>
        )}
      </div>
    </div>
  );
}
