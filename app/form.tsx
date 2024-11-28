import { IconPhotoUp } from "@tabler/icons-react";
import { useState } from "react";

interface UploadFormProps {
  onUploadComplete: () => Promise<void>;
}

export default function UploadForm({ onUploadComplete }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [currentWeight, setCurrentWeight] = useState<string>(""); // State for current weight
  const [inProgress, setInProgress] = useState(false);
  const [fileInfo, setFileInfo] = useState("No Files Selected");
  const [isOver, setIsOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.item(0) || null;

    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      setFile(null); // Reset the file input
      setFileInfo("No Files Selected");
      return;
    }

    setFile(selectedFile);
    if (selectedFile) {
      setFileInfo(`${selectedFile.name}, ${selectedFile.size} bytes`);
    }
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setFileInfo(`${selectedFile.name}`);
    }
    setIsOver(false);
  };

  return (
    <div className="flex flex-col gap-[20px] w-[400px] max-[567px]:w-[300px] max-[410px]:w-[250px]">
      <div>
        <h2 className="text-[20px]">Progress Photo</h2>
        <p className="">Upload a picture of your progress</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] form-uploading-container">
        <div className="dropzone-box">
          <div
            className={`dropzone-area ${isOver ? "dropzone--over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="file-upload-icon">
              <IconPhotoUp width={50} height={50} className="text-zinc-700 dark:text-zinc-600"/>
            </div>
            <input
              type="file"
              accept="image/*" // Restrict to image file types
              onChange={handleFileChange}
              required
              className="absolute opacity-0 top-0 right-0 bottom-0 left-0 cursor-pointer"
            />
            <p className="file-info">{fileInfo}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-[10px]">
          <p className="text-[16px] font-[500] text-black dark:text-white">Input Current Weight</p>
          <input
            type="text"
            placeholder="Current Weight (kg)"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            required
            className="py-[12px] px-[15px] border border-zinc-400 dark:border-zinc-600 rounded-md w-full"
          />
        </div>

        <div className="dropzone-actions flex justify-between flex-wrap mt-[10px]">
          <button
            type="submit"
            disabled={inProgress}
            className="!bg-primary-900 rounded-md px-4 py-2 font-bold text-gray-500 border-none"
          >
            <span className="text-white text-[16px] font-[400]">{inProgress ? "Uploading..." : "Upload"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
