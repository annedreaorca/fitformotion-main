import ProfileActions from "@/app/(protected)/profile/_components/ProfileActions";
import KebabMenu from "@/components/KebabMenu/KebabMenu";
import PageHeading from "@/components/PageHeading/PageHeading";
import DashboardCards from "./_components/DashboardCards/DashboardCards";
import DashboardCharts from "./_components/DashboardCharts/DashboardCharts";
import DashboardGoals from "./_components/DashboardGoals/DashboardGoals";
import DashboardLinks from "./_components/DashboardLinks";

import { IconSettings, IconUser } from "@tabler/icons-react";

export default function DashboardPage({
  searchParams,
  }: {
    searchParams?: {
      chart1?: string;
      chart2?: string;
      chart3?: string;
      chart4?: string;
    };
  }) {
    const chart1DateRange = searchParams?.chart1 || "1W";
    const chart2DateRange = searchParams?.chart2 || "1W";
    const chart3DateRange = searchParams?.chart3 || "1W";
    const chart4DateRange = searchParams?.chart4 || "1W";

    const menuItems = [
      {
        icon: <IconUser size={22} />,
        label: "Profile",
        href: "/profile",
      },
      {
        icon: <IconSettings size={22} />,
        label: "Settings",
        href: "/profile/advanced",
      },
    ];

  return (
    <div className="page-container">
      <div className="flex justify-between">
        <PageHeading title="Dashboard Overview" />
        <KebabMenu
            items={menuItems}
            header="Menu"
            footer={<ProfileActions />}
            kebabClassName="bg-zinc-50"
            itemClassName="hover:bg-blue-100"
        />
      </div>
      <DashboardCards />
      <DashboardCharts
        chart1DateRange={chart1DateRange}
        chart2DateRange={chart2DateRange}
        chart3DateRange={chart3DateRange}
        chart4DateRange={chart4DateRange}
      />

      <DashboardLinks />

      <DashboardGoals />

      {/* <Suspense fallback={<div>Loading Recent Activity...</div>}>
        <DashboardRecentActivity />
      </Suspense> */}
    </div>
  );
}
