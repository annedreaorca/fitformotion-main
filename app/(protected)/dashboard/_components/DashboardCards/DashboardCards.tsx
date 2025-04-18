import { Spinner } from "@nextui-org/spinner";
import {
  IconCalendarWeek,
  IconFlame,
  IconHourglass,
  IconTrophy
} from "@tabler/icons-react";
import { Suspense } from "react";
import DashboardCardAverageWorkoutDuration from "./DashboardCardAverageWorkoutDuration";
import DashboardCardTemplate from "./DashboardCardTemplate";
import DashboardCardWeeklyWorkouts from "./DashboardCardWeeklyWorkouts";

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 max-[510px]:grid-cols-1 gap-3 mb-3">
      <Suspense
        fallback={
          <DashboardCardTemplate
            title="Weekly Workouts"
            icon={<IconCalendarWeek className="text-primary" />}
          >
            <Spinner color="primary" />
          </DashboardCardTemplate>
        }
      >
        <DashboardCardWeeklyWorkouts />
      </Suspense>
      <Suspense
        fallback={
          <DashboardCardTemplate
            title="Avg Workout Time"
            icon={<IconHourglass className="text-primary" />}
          >
            <Spinner color="primary" />
          </DashboardCardTemplate>
        }
      >
        <DashboardCardAverageWorkoutDuration />
      </Suspense>
      {/* <DashboardCardTemplate title="Goal One" icon={<IconTarget className="text-primary" />}>
        1
      </DashboardCardTemplate>
      <DashboardCardTemplate title="Goal Two" icon={<IconTarget className="text-primary" />}>
        2
      </DashboardCardTemplate>
      <DashboardCardTemplate title="Goal Three" icon={<IconTarget className="text-primary" />}>
        3
      </DashboardCardTemplate>
      <DashboardCardTemplate title="Goal Four" icon={<IconTarget className="text-primary" />}>
        4
      </DashboardCardTemplate> */}
    </div>
  );
}
