import PageHeading from "@/components/PageHeading/PageHeading";
import ActivityList from "./_components/ActivityList";
import { Suspense } from "react";

export default async function ActivityPage() {
  return (
    <div className="page-container">
      <PageHeading title="Activity" />
      <Suspense fallback={<div>Loading...</div>}>
        <ActivityList />
      </Suspense>
    </div>
  );
}
