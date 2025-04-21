// DashboardCharts.tsx
import { Suspense } from "react";
import {
  IconBarbell,
  IconChartAreaFilled,
  IconChartBar,
  IconChartRadar
} from "@tabler/icons-react";
import DashboardChartCard from "./DashboardChartCard";
import DashboardChartProgressOverTime from "./DashboardChartProgressOverTime";
import DashboardChartWeightProgress from "./DashboardChartWeightProgress";
import DashboardChartWorkoutFrequency from "./DashboardChartWorkoutFrequency";
import DashboardChartExerciseMuscleDistribution from "./DashboardChartExerciseMuscleDistribution";
import DashboardAverageWorkoutTime from "./DashboardAverageWorkoutTime";

export default function DashboardCharts({
  chart1DateRange,
  chart2DateRange,
  chart3DateRange,
  chart4DateRange,
}: {
  chart1DateRange?: string;
  chart2DateRange?: string;
  chart3DateRange?: string;
  chart4DateRange?: string;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-3">
      <DashboardChartCard
        icon={<IconChartBar className="text-primary" />}
        title="Workout Frequency"
        colSpan="col-span-2 lg:col-span-4 xl:col-span-2"
        chartId={1}
        showDateRange={false}
      >
        <Suspense fallback={<div>Loading Chart...</div>}>
          <DashboardChartWorkoutFrequency />
        </Suspense>
      </DashboardChartCard>

      {/* <DashboardChartCard
        icon={<IconChartAreaFilled className="text-primary" />}
        title="Lift Progress"
        colSpan="col-span-2"
        chartId={2}
      >
        <Suspense fallback={<div>Loading Chart...</div>}>
          <DashboardChartProgressOverTime dateRange={chart2DateRange} />
        </Suspense>
      </DashboardChartCard> */}

      {/* <DashboardChartCard
        icon={<IconChartAreaFilled className="text-primary" />}
        title="Average Workout Time"
        colSpan="col-span-2"
        chartId={3}
        showDateRange={true}
      >
        <Suspense fallback={<div>Loading Chart...</div>}>
          <DashboardAverageWorkoutTime dateRange={chart3DateRange} />
        </Suspense>
      </DashboardChartCard> */}

      <DashboardChartCard
        icon={<IconBarbell className="text-primary"/>}
        title="Weight Progress"
        colSpan="col-span-2"
        chartId={4}
        showDateRange={true}
      >
        <Suspense fallback={<div>Loading Chart...</div>}>
          <DashboardChartWeightProgress dateRange={chart4DateRange} />
        </Suspense>
      </DashboardChartCard>

      <DashboardChartCard 
        icon={<IconChartRadar />} 
        title='Exercise Split' 
        colSpan="col-span-2" 
        chartId={4}
      >
        <Suspense fallback={<div>Loading Chart...</div>}>
          <DashboardChartExerciseMuscleDistribution dateRange={chart4DateRange} />
        </Suspense>
      </DashboardChartCard>
    </div>
  );
}