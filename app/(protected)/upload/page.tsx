"use client";
import { useState } from 'react';
import UploadForm from '@/app/form'; // Adjust the path as needed

export default function Page() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadCompletion = async () => {
    setIsUploading(true);

    try {
      // Perform any additional actions after upload if needed
      console.log("Upload complete!");
      // For example, handle saving data or updating UI
    } catch (error) {
      console.error("Error during upload completion:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <UploadForm onUploadComplete={handleUploadCompletion} />
      {/* Other page content */}
    </div>
  );
}
