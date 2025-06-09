"use client";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  shareId: string | null;
  routineId: string;
};

export default function ShareRoutineButtons({ shareId, routineId }: Props) {
  const router = useRouter();

  const handleCopy = async () => {
    if (!shareId) {
      toast.error("This routine cannot be shared.");
      return;
    }

    const url = `${window.location.origin}/shared-routine/${shareId}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleImport = async () => {
    const res = await fetch("/api/routines/import", {
      method: "POST",
      body: JSON.stringify({ shareId }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Routine imported successfully!");
      router.push(`/edit-routine/step-3?id=${data.newRoutineId}`);
    } else {
      toast.error(data.error || "Failed to import.");
    }
  };

  return (
    <div className="flex gap-3 mt-5">
      <Button color="primary" onClick={handleCopy}>
        Share Routine
      </Button>
      <Button color="secondary" onClick={handleImport} isDisabled={!shareId}>
        Import Routine
      </Button>
    </div>
  );
}
