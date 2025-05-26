// C:\Users\anned\Desktop\fitformotion\app\(protected)\dashboard\_components\DashboardViewToggle.tsx
"use client";
import { Switch } from "@nextui-org/switch";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAdvanced, setIsAdvanced] = useState<boolean>(
    searchParams.get("view") === "advanced"
  );

  useEffect(() => {
    // Update URL when view changes
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (isAdvanced) {
      current.set("view", "advanced");
    } else {
      current.delete("view");
    }
    
    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    router.replace(`/dashboard${query}`);
  }, [isAdvanced, router, searchParams]);

  return (
    <div className="flex items-center gap-2 dashboard-view-toggle">
      <Switch
        size="sm"
        color="primary"
        isSelected={isAdvanced}
        onValueChange={setIsAdvanced}
        aria-label="Toggle advanced view"
        classNames={{
          base: "flex-row-reverse"
        }}
      />
      <span className="text-[16px] ml-1">{isAdvanced ? "Advanced" : "Beginner"}</span>
    </div>
  );
}