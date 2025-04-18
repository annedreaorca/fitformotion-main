// DashboardChartCard.tsx
import { ReactNode } from "react";
import DashboardChartDateRange from "./DashboardChartDateRange";

export default function DashboardChartCard({
  children,
  icon,
  title,
  colSpan = "col-span-2",
  chartId,
  showDateRange = true
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
  colSpan?: string;
  chartId: number;
  showDateRange?: boolean;
}) {
  return (
    <div
      className={`${colSpan} bg-white dark:bg-zinc-900 rounded-xl shadow-sm dark:shadow-zinc-800 p-3 h-60`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2 items-center">
          <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex justify-center items-center">
            {icon}
          </div>
          <h2 className="font-semibold">{title}</h2>
        </div>
        {showDateRange && <DashboardChartDateRange chartId={chartId} />}
      </div>
      <div className="h-[calc(100%-48px)]">{children}</div>
    </div>
  );
}