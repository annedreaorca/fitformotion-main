"use client";
import { ThemeSwitcher } from "@/components/ThemeSwitcher/ThemeSwitcher";
import { useSidebarToggleContext } from "@/contexts/SidebarToggleContext";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface NavItemProps {
  icon: JSX.Element;
  label?: string;
  href?: string;
  active: boolean;
}

import {
  IconBarbell,
  IconBodyScan,
  IconCrown,
  IconHistory,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconListSearch,
  IconMessageChatbot
} from "@tabler/icons-react";

export default function SidebarNav() {
  const { sidebarCollapse, toggleSidebar } = useSidebarToggleContext();
  const pathname = usePathname();

  return (
    <div className="px-5">
      <ul className="text-sm">
        <NavItem
          icon={<IconLayoutDashboard size={22} className="shrink-0" />}
          label="Dashboard"
          href="/dashboard"
          active={pathname === "/dashboard"}
        />

        {/* <NavItem
          icon={<IconUser size={22} className="shrink-0" />}
          label="Profile"
          href="/profile"
          active={pathname === "/profile"}
        /> */}

        <NavItem
          icon={<IconListSearch size={22} className="shrink-0" />}
          label="Browse Exercises"
          href="/exercises"
          active={pathname === "/exercises"}
        />

        <NavItem
          icon={<IconBarbell size={22} className="shrink-0" />}
          label="Start Workout"
          href="/workout"
          active={pathname.startsWith("/workout")}
        />

        <NavItem
          icon={<IconHistory size={22} className="shrink-0" />}
          label="Workout History"
          href="/activity"
          active={pathname === "/activity"}
        />

        {/* <NavItem
          icon={<IconClipboardList size={22} className="shrink-0" />}
          label="Routine Planner"
          href="/edit-routine/step-1"
          active={pathname.startsWith("/edit-routine/")}
        /> */}

        {/* <NavItem
          icon={<IconSettings size={22} className="shrink-0" />}
          label="Settings"
          href="/profile/advanced"
          active={pathname.startsWith("/profile/advanced")}
        /> */}

        <NavItem
          icon={<IconBodyScan size={22} className="shrink-0" />}
          label="My Physique"
          href="/gallery"
          active={pathname.startsWith("/gallery")}
        />

        {/* <NavItem
          icon={<IconMessageChatbot size={22} className="shrink-0" />}
          label="ChatBot"
          href="/chatbot"
          active={pathname === "/chatbot"}
        /> */}

        <NavItem
          icon={<IconCrown size={22} className="shrink-0" />}
          label="Get Premium"
          href="/premium"
          active={pathname.startsWith("/premium")}
        />
        
        <SidebarToggle />

        <div className="absolute bottom-0 left-0 right-0 py-5 px-5 flex flex-col items-start gap-[20px]">
          <div className="flex flex-col items-center w-[100%]">
            <ThemeSwitcher />
          </div>
        </div>
      </ul>
    </div>
  );
}

function SubMenuTitle({ title }: { title: string }) {
  const { sidebarCollapse } = useSidebarToggleContext();

  return (
    !sidebarCollapse && (
      <li className="uppercase text-xs text-zinc-600 dark:text-zinc-400 font-semibold mb-1 mt-4 px-2">
        {title}
      </li>
    )
  );
}

function NavItem({ icon, label, href, active }: NavItemProps) {
  const { sidebarCollapse } = useSidebarToggleContext();

  const styles = {
    button_bg_primary_800: {
      backgroundColor: "#991b1b",
    },
  };

  const content = (
    <div
      className={clsx(
        "flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out",
        sidebarCollapse ? "justify-center" : "",
        active
          ? "bg-zinc-300 text-black dark:text-primary text-white"
          : "text-zinc-600 dark:text-zinc-400 text-white",
      )}
      style={active ? styles.button_bg_primary_800 : {}}
    >
      {icon}
      {!sidebarCollapse && label && <div>{label}</div>}
    </div>
  );

  return (
    <li className="my-1">
      <Link href={href || "#"}>{content}</Link>
    </li>
  );
}

function SidebarToggle() {
  const { sidebarCollapse, toggleSidebar } = useSidebarToggleContext();

  return (
    <li onClick={toggleSidebar} className="cursor-pointer my-1">
      <div
        className={clsx(
          "flex items-center space-x-3 p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out",
          sidebarCollapse ? "justify-center" : "",
        )}
      >
        {sidebarCollapse ? (
          <IconLayoutSidebarLeftExpand size={22} className="shrink-0" />
        ) : (
          <IconLayoutSidebarLeftCollapse size={22} className="shrink-0" />
        )}
        {!sidebarCollapse && <div>Collapse Sidebar</div>}
      </div>
    </li>
  );
}
