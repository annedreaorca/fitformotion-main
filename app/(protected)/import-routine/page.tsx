"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { IconDownload, IconLink } from "@tabler/icons-react";
import { toast } from "sonner";
import PageHeading from "@/components/PageHeading/PageHeading";

export default function ImportRoutinePage() {
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const extractShareId = (url: string): string | null => {
    try {
      // Handle both full URLs and just share IDs
      if (url.includes("/import-routine/")) {
        const parts = url.split("/import-routine/");
        return parts[1] || null;
      }
      // If it's just the share ID
      if (url.length >= 8 && url.length <= 15 && !url.includes("/")) {
        return url;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleImport = async () => {
    if (!shareUrl.trim()) {
      toast.error("Please enter a share URL or ID");
      return;
    }

    const shareId = extractShareId(shareUrl.trim());
    if (!shareId) {
      toast.error("Invalid share URL or ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/routines/import/${shareId}`, {
        method: "POST",
      });

      if (response.ok) {
        const { routineId } = await response.json();
        toast.success("Routine imported successfully!");
        router.push(`/workout`);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to import routine");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import routine");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="mb-8">
        <PageHeading title="Import Routine" />
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Import a shared workout routine by entering the share URL or ID
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconDownload size={24} className="text-primary" />
            <h2 className="text-xl font-semibold">Import Shared Routine</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Share URL or ID
            </label>
            <Input
              placeholder="Paste the share URL or enter the share ID"
              value={shareUrl}
              onChange={(e) => setShareUrl(e.target.value)}
              startContent={<IconLink size={20} className="text-zinc-400" />}
              size="lg"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Example: https://yoursite.com/import-routine/abc123xyz or just abc123xyz
            </p>
          </div>

          <Button
            color="primary"
            size="lg"
            onClick={handleImport}
            isLoading={isLoading}
            className="w-full"
            startContent={!isLoading && <IconDownload size={20} />}
          >
            {isLoading ? "Importing..." : "Import Routine"}
          </Button>
        </CardBody>
      </Card>

      <div className="mt-8 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        <h3 className="font-semibold mb-2">How to import a routine:</h3>
        <ol className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>1. Get a share URL or ID from someone who shared their routine</li>
          <li>2. Paste it in the field above</li>
          <li>3. Click &quot;Import Routine&quot; to add it to your routines</li>
        </ol>
      </div>
    </div>
  );
}