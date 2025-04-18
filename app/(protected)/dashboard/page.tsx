import ProfileActions from "@/app/(protected)/profile/_components/ProfileActions";
import KebabMenu from "@/components/KebabMenu/KebabMenu";
import PageHeading from "@/components/PageHeading/PageHeading";
import { startTour } from "@/components/TourGuide/DashboardGuide";
import { IconSettings, IconUser, IconWalk } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import DashboardCards from "./_components/DashboardCards/DashboardCards";
import DashboardCharts from "./_components/DashboardCharts/DashboardCharts";
import DashboardGoals from "./_components/DashboardGoals/DashboardGoals";
import DashboardLinks from "./_components/DashboardLinks";
import DashboardRecentActivity from "./_components/DashboardRecentActivity";
import { Suspense } from "react";

// Load TourGuide only on the client side
const TourGuide = dynamic(() => import("@/components/TourGuide/DashboardGuide"), { ssr: false });

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
      <div className="flex items-center justify-between mb-6">
        <div id="dashboard-heading">
          <PageHeading title="Dashboard Overview"/>
        </div>
        
        <div className="flex gap-[10px] items-center">
          <button
            onClick={startTour}
            className="p-[5px] bg-zinc-800 text-white rounded-full hover:bg-zinc-700 w-10 h-10 flex items-center justify-center"
          >
            <IconWalk size={22} />
          </button>
          <KebabMenu
            items={menuItems}
            header="Menu"
            footer={<ProfileActions />}
            itemClassName="hover:bg-blue-100"
          />
        </div>
      </div>
      <div id="dashboard-cards">
        <DashboardCards />
      </div>
      <div id="dashboard-charts">
      <DashboardCharts
          chart1DateRange={chart1DateRange}
          chart2DateRange={chart2DateRange}
          chart3DateRange={chart3DateRange}
          chart4DateRange={chart4DateRange}
        />
      </div>
      <div id="dashboard-links">
        <DashboardLinks />
      </div>
      <div id="dashboard-goals">
        <DashboardGoals />
      </div>
      
      <Suspense fallback={<div>Loading Recent Activity...</div>}>
        <DashboardRecentActivity />
      </Suspense>
      <TourGuide autoStart={false} />
    </div>
  );
}