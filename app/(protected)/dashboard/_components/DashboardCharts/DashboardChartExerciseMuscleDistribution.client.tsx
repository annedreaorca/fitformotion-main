"use client";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import ChartMockDataMessage from "./ChartMockDataMessage";

type ExerciseMuscleData = {
  muscle: string;
  count: number;
};

export default function DashboardChartExerciseMuscleDistributionClient({
  data,
  isUsingMockData
}: {
  data: ExerciseMuscleData[];
  isUsingMockData?: boolean;
}) {
  return (
    <div className="relative w-full h-full">
      {isUsingMockData && (<ChartMockDataMessage />)}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="muscle" fontSize={12} />
          <Tooltip />
          <Radar
            name="Frequency"
            dataKey="count"
            stroke="#8884d8"
            fill="#A6FF00"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}