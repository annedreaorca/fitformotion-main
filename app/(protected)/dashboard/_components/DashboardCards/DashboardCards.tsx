import { Spinner } from "@nextui-org/spinner";
import {
  IconCalendarWeek,
  IconHourglass
} from "@tabler/icons-react";
import { Suspense } from "react";
import DashboardCardAverageWorkoutDuration from "./DashboardCardAverageWorkoutDuration";
import DashboardCardTemplate from "./DashboardCardTemplate";
import DashboardCardWeeklyWorkouts from "./DashboardCardWeeklyWorkouts";
import DashboardCardWeightProgress from "./DashboardCardWeightProgress";
import DashboardCardMuscleDistribution from "./DashboardCardMuscleDistribution";

export default function DashboardCards({
  isAdvancedView = false
}: {
  isAdvancedView?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 max-[510px]:grid-cols-1 gap-3 mb-3">
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
      <Suspense
        fallback={
          <DashboardCardTemplate
            title="Current Weight"
            icon={<IconHourglass className="text-primary" />}
          >
            <Spinner color="primary" />
          </DashboardCardTemplate>
        }
      >
        <DashboardCardWeightProgress />
      </Suspense>
      <Suspense
        fallback={
          <DashboardCardTemplate
            title="Top Muscle Group"
            icon={<IconHourglass className="text-primary" />}
          >
            <Spinner color="primary" />
          </DashboardCardTemplate>
        }
      >
        <DashboardCardMuscleDistribution />
      </Suspense>
    </div>
  );
}