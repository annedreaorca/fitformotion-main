import { Suspense } from "react";
import {
  IconBarbell,
  IconChartAreaFilled,
  IconChartBar,
  IconChartRadar
} from "@tabler/icons-react";
import DashboardChartCard from "./DashboardChartCard";
import DashboardChartWeightProgress from "./DashboardChartWeightProgress";
import DashboardChartWorkoutFrequency from "./DashboardChartWorkoutFrequency";
import DashboardChartExerciseMuscleDistribution from "./DashboardChartExerciseMuscleDistribution";
import DashboardAverageWorkoutTime from "./DashboardAverageWorkoutTime";

export default function DashboardCharts({
  chart1DateRange,
  chart3DateRange,
  chart4DateRange,
  isAdvancedView = false,
}: {
  chart1DateRange?: string;
  chart2DateRange?: string;
  chart3DateRange?: string;
  chart4DateRange?: string;
  isAdvancedView?: boolean;
}) {
  // If not in advanced view, don't render any charts
  if (!isAdvancedView) {
    return null;
  }

  // Only render charts in advanced view
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-3">
      <DashboardChartCard
        icon={<IconChartBar className="text-primary" />}
        title="Workout Frequency"
        colSpan="col-span-1"
        chartId={1}
        showDateRange={true}
      >
        <Suspense fallback={<div>Loading Chart...</div>}>
          <DashboardChartWorkoutFrequency />
        </Suspense>
      </DashboardChartCard>

      <DashboardChartCard
        icon={<IconChartAreaFilled className="text-primary" />}
        title="Average Workout Time"
        colSpan="col-span-1"
        chartId={3}
        showDateRange={true}
      >
        <Suspense fallback={<div>Loading Chart...</div>}>
          <DashboardAverageWorkoutTime dateRange={chart3DateRange} />
        </Suspense>
      </DashboardChartCard>

      <DashboardChartCard
        icon={<IconBarbell className="text-primary"/>}
        title="Weight Progress"
        colSpan="col-span-1"
        chartId={4}
        showDateRange={true}
      >
        <Suspense fallback={<div>Loading Chart...</div>}>
          <DashboardChartWeightProgress dateRange={chart4DateRange} />
        </Suspense>
      </DashboardChartCard>

      <DashboardChartCard 
        icon={<IconChartRadar className="text-primary" />} 
        title='Exercise Split' 
        colSpan="col-span-1" 
        chartId={5}
      >
        <Suspense fallback={<div>Loading Chart...</div>}>
          <DashboardChartExerciseMuscleDistribution dateRange={chart4DateRange} />
        </Suspense>
      </DashboardChartCard>
    </div>
  );
}