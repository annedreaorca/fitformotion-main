import { useState } from "react";

interface UploadFormProps {
  onUploadComplete: () => Promise<void>;
}

export default function UploadForm({ onUploadComplete }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [currentWeight, setCurrentWeight] = useState<string>(""); // State for current weight
  const [inProgress, setInProgress] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.item(0) || null;

    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      setFile(null); // Reset the file input
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInProgress(true);

    if (!file || !currentWeight) {
      alert("Please select a valid image file and enter your current weight.");
      setInProgress(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("currentWeight", currentWeight); // Append current weight

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload error:", errorText);
        throw new Error("Failed to upload file");
      }

      await onUploadComplete(); // Notify when upload is complete
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setInProgress(false);
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <h2 className="text-[20px]">Upload a picture of your progress</h2>
      <form onSubmit={handleSubmit} className="form-uploading-container">
        <input
          type="file"
          accept="image/*" // Restrict to image file types
          onChange={handleFileChange}
          required
        />
        <input
          type="text"
          placeholder="Current Weight (kg)"
          value={currentWeight}
          onChange={(e) => setCurrentWeight(e.target.value)}
          required
        />
        <button type="submit" disabled={inProgress}>
          <span className="upload-form-button">
            {inProgress ? "Uploading..." : "Upload"}
          </span>
        </button>
      </form>
    </div>
  );
}