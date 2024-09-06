import { useState } from "react";
import Image from "next/image";

interface UploadFormProps {
    onUploadComplete: () => Promise<void>;
}

export default function UploadForm({ onUploadComplete }: UploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [inProgress, setInProgress] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInProgress(true);

        if (!file) {
            alert("No file selected");
            setInProgress(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file");
            }

            const data = await response.json();
            setPreview(data.imageUrl);
            await onUploadComplete(); // Notify when upload is complete
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setInProgress(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files?.item(0) || null)}
            />
            <button type="submit">
                {inProgress ? "Uploading..." : "Upload"}
            </button>
            {preview && (
                <div>
                    <Image src={preview} alt="Uploaded preview" width={200} height={200} />
                </div>
            )}
        </form>
    );
}
