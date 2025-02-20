import PageHeading from "@/components/PageHeading/PageHeading";
import { Suspense } from "react";
import ActivityList from "./_components/ActivityList";

export default async function ActivityPage() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <PageHeading title="Activity" />
        {/* <div className="flex gap-[10px] items-center">
          <button
            onClick={startTour}
            className="p-[5px] bg-zinc-800 text-white rounded-full hover:bg-zinc-700 w-10 h-10 flex items-center justify-center"
          >
            <IconWalk size={22} />
          </button>
        </div> */}
      </div>
      <Suspense fallback={<div className="h-[90vh] w-[90vw] flex items-center justify-center absolute">Loading...</div>}>
        <ActivityList />
      </Suspense>
    </div>
  );
}
