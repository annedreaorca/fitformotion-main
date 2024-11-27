import { Card, CardBody, CardHeader } from "@nextui-org/card";
import DeleteDashboardGoal from "./DeleteDashboardGoal";

export default function DashboardGoalTemplate({
  children,
  title,
  icon,
  showSettings,
  id,
}: {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  showSettings?: boolean;
  id?: string;
}) {
  return (
    <Card shadow="none" className="shadow-md min-h-[148px]">
      <CardHeader className="px-3 text-xs uppercase w-full truncate flex justify-between items-center">
        <div className="flex gap-3 items-center text-zinc-700 dark:text-zinc-500">
          {icon}
          {title}
        </div>
        {showSettings && id && <DeleteDashboardGoal id={id} />}
      </CardHeader>
      <CardBody className="px-3 pt-0 relative">
        <div className="mb-3">{children}</div>
      </CardBody>
    </Card>
  );
}
