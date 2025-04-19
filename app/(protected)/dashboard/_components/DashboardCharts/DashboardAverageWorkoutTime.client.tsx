"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import ChartMockDataMessage from "./ChartMockDataMessage";

type WorkoutData = {
  period: string;
  duration: number;
};

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 text-white px-4 py-2 rounded-xl shadow-xl text-xs">
        <p className="font-semibold">
          Duration: <span className="text-primary">{payload[0].value}</span> minutes
        </p>
        <p>Period: {label}</p>
      </div>
    );
  }

  return null;
}

export default function DashboardAverageWorkoutTimeClient({
  data,
  isUsingMockData,
  chartId = 1,
  dateRange = "1W",
}: {
  data: WorkoutData[];
  isUsingMockData?: boolean;
  chartId?: number;
  dateRange?: string;
}) {
  return (
    <div className="flex flex-col h-full relative">
      {isUsingMockData && <ChartMockDataMessage />}

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          aria-label="Average Workout Duration Chart"
        >
          <Area
            type="monotone"
            dataKey="duration"
            stroke="#6366f1"
            fill="#a5b4fc"
            aria-label="Average Duration Area"
          />
          <XAxis dataKey="period" tick={{ fontSize: "10px" }} />
          <YAxis 
            label={{ 
              value: 'Minutes', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: '10px' }
            }}
            tick={{ fontSize: "10px" }}
          />
          <Tooltip content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}