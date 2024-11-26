import PageHeading from "@/components/PageHeading/PageHeading";
import { Suspense } from "react";
import ActivityList from "./_components/ActivityList";

export default async function ActivityPage() {
  return (
    <div className="page-container">
      <PageHeading title="Activity" />
      <Suspense fallback={<div className="h-[90vh] w-[90vw] flex items-center justify-center absolute">Loading...</div>}>
        <ActivityList />
      </Suspense>
    </div>
  );
}
