// C:\Users\anned\Desktop\fitformotion\app\(protected)\dashboard\_components\DashboardCharts\DashboardChartWeightProgress.client.tsx

"use client";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
} from "recharts";
import ChartMockDataMessage from "./ChartMockDataMessage";

type UserWeightData = {
  period: string;
  totalWeight: number; 
};

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-300 dark:bg-zinc-800 text-white px-4 py-2 rounded-xl shadow-xl text-xs border-1 border-zinc-400 dark:border-zinc-700">
        <p className="font-[500] text-zinc-700 dark:text-zinc-400">
          Weight: <span className="text-zinc-900 dark:text-zinc-200 font-[400]">{payload[0].value} lbs</span>
        </p>
        <p className="font-[500] text-zinc-700 dark:text-zinc-400">
          Recorded on: <span className="text-zinc-900 dark:text-zinc-200 font-[400]">{label}</span>
        </p>
      </div>
    );
  }

  return null;
}

export default function DashboardChartWeightProgressClient({
  data,
  isUsingMockData,
}: {
  data: UserWeightData[];
  isUsingMockData?: boolean;
}) {
  return (
    <div className="relative w-full h-full">
      {isUsingMockData && (<ChartMockDataMessage />)}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="totalWeight" stroke="#000000" />
          <XAxis dataKey="period" tick={{ fontSize: "10px" }} />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}