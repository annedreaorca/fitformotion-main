import { Card, CardBody, CardHeader } from "@nextui-org/card";
import clsx from "clsx";
import React from "react";
import DashboardChartDateRange from "./DashboardChartDateRange";

export default function DashboardChartCard({
  children,
  title,
  colSpan,
  chartId,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  colSpan?: string;
  chartId: number;
  icon: React.ReactNode;
}) {
  return (
    <Card shadow="none" className={clsx("shadow-md h-72", colSpan)}>
      <CardHeader className="p-3 gap-5 items-start justify-between">
        <p className="shrink-0 w-1/2 flex items-center gap-x-3 truncate font-[400] text-xs uppercase text-zinc-700 dark:text-zinc-500">
          <span className="text-primary">{icon}</span> {title}
        </p>
        <DashboardChartDateRange chartId={chartId} />
      </CardHeader>
      <CardBody className="p-3 pb-0">{children}</CardBody>
    </Card>
  );
}
