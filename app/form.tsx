import { useState } from "react";

interface UploadFormProps {
    onUploadComplete: () => Promise<void>;
}

export default function UploadForm({ onUploadComplete }: UploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [workoutName, setWorkoutName] = useState<string>(""); // Add state for workout name
    const [inProgress, setInProgress] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInProgress(true);

        if (!file || !workoutName) {
            alert("Please select a file and enter a workout name.");
            setInProgress(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("workoutName", workoutName); // Append workout name

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text(); // Log error text for debugging
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
                    onChange={(e) => setFile(e.target.files?.item(0) || null)}
                />
                <input
                    type="text"
                    placeholder="Workout Name"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    required
                />
                <button type="submit">
                    <span className="upload-form-button">{inProgress ? "Uploading..." : "Upload"}</span>
                </button>
            </form>
        </div>
    );
}
