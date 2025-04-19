// app\(protected)\dashboard\_components\DashboardCharts\DashboardChartWorkoutFrequency.client.tsx

"use client";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  CartesianGrid,
  YAxis,
  ReferenceLine,
} from "recharts";
import { useState } from "react";
import ChartMockDataMessage from "./ChartMockDataMessage";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type WeeklyWorkoutData = {
  week: string;
  daysWorkedOut: number;
  startDate: string;
  endDate: string;
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
          Days Worked Out: <span className="text-primary">{payload[0].value}</span>
        </p>
        <p>Week: {label}</p>
      </div>
    );
  }
  return null;
}

export default function DashboardChartWorkoutFrequencyClient({
  data,
  isUsingMockData,
}: {
  data: WeeklyWorkoutData[];
  isUsingMockData?: boolean;
}) {
  // Define how many weeks to show per page
  const weeksPerPage = 4;
  const totalPages = Math.ceil(data.length / weeksPerPage);
  
  // Calculate the default page index to show the most recent data
  const defaultPageIndex = Math.max(0, totalPages - 1);
  
  // State for pagination with default set to show the current week
  const [pageIndex, setPageIndex] = useState(defaultPageIndex);
  
  // Calculate data slice for current page
  const startIndex = pageIndex * weeksPerPage;
  const currentPageData = data.slice(startIndex, Math.min(startIndex + weeksPerPage, data.length));
  
  // Navigation handlers
  const handlePrevious = () => {
    setPageIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setPageIndex(prev => Math.min(totalPages - 1, prev + 1));
  };
  
  return (
    <div className="flex flex-col h-full relative">
      {isUsingMockData && <ChartMockDataMessage />}
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentPageData}
            margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
            aria-label="Weekly Workouts Bar Chart"
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: "10px" }} 
              axisLine={false} 
              tickLine={false} 
              interval={0}
              height={35}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fontSize: "10px" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 7]}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <ReferenceLine y={7} stroke="#ddd" strokeDasharray="3 3" />
            <Bar dataKey="daysWorkedOut" fill="#000000" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-2">
        <button 
          onClick={handlePrevious}
          disabled={pageIndex === 0}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <IconChevronLeft size={18} />
        </button>
        
        <div className="text-xs text-gray-500">
          {pageIndex + 1} / {totalPages}
        </div>
        
        <button 
          onClick={handleNext}
          disabled={pageIndex >= totalPages - 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <IconChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}