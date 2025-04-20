"use client";
import { ThemeSwitcher } from "@/components/ThemeSwitcher/ThemeSwitcher";
import { useSidebarToggleContext } from "@/contexts/SidebarToggleContext";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavItemProps {
  icon: JSX.Element;
  label?: string;
  href?: string;
  active: boolean;
  disabled?: boolean;
}

import {
  IconBarbell,
  IconBodyScan,
  IconHistory,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconListSearch,
  IconMessageChatbot,
  IconUser,
  IconLock
} from "@tabler/icons-react";

export default function SidebarNav() {
  const { sidebarCollapse, toggleSidebar } = useSidebarToggleContext();
  const pathname = usePathname();
  const [profileComplete, setProfileComplete] = useState(true);

  useEffect(() => {
    // Fetch profile completion status
    async function checkProfileCompletion() {
      try {
        const response = await fetch('/api/profile/check-completion');
        const data = await response.json();
        setProfileComplete(data.isComplete);
      } catch (error) {
        console.error("Error checking profile completion:", error);
        // Default to true to avoid blocking navigation if API fails
        setProfileComplete(true);
      }
    }

    checkProfileCompletion();
  }, []);

  return (
    <div className="px-5">
      <ul className="text-sm">
        <NavItem
          icon={<IconLayoutDashboard size={22} className="shrink-0" />}
          label="Dashboard"
          href="/dashboard"
          active={pathname === "/dashboard"}
          disabled={!profileComplete}
        />

        <NavItem
          icon={<IconUser size={22} className="shrink-0" />}
          label="Profile"
          href="/profile"
          active={pathname === "/profile"}
          // Profile page is always accessible
        />

        <NavItem
          icon={<IconListSearch size={22} className="shrink-0" />}
          label="Browse Exercises"
          href="/exercises"
          active={pathname === "/exercises"}
          disabled={!profileComplete}
        />

        <NavItem
          icon={<IconBarbell size={22} className="shrink-0" />}
          label="Start Workout"
          href="/workout"
          active={pathname.startsWith("/workout")}
          disabled={!profileComplete}
        />

        <NavItem
          icon={<IconHistory size={22} className="shrink-0" />}
          label="Workout History"
          href="/activity"
          active={pathname === "/activity"}
          disabled={!profileComplete}
        />

        <NavItem
          icon={<IconBodyScan size={22} className="shrink-0" />}
          label="My Physique"
          href="/gallery"
          active={pathname.startsWith("/gallery")}
          disabled={!profileComplete}
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

function NavItem({ icon, label, href, active, disabled = false }: NavItemProps) {
  const { sidebarCollapse } = useSidebarToggleContext();

  const styles = {
    button_bg_primary_800: {
      backgroundColor: "#991b1b",
    },
  };

  const content = (
    <div
      className={clsx(
        "flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ease-in-out",
        sidebarCollapse ? "justify-center" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-300 dark:hover:bg-zinc-800",
        active && !disabled
          ? "bg-zinc-300 text-black dark:text-primary text-white"
          : "text-zinc-600 dark:text-zinc-400 text-white",
      )}
      style={active && !disabled ? styles.button_bg_primary_800 : {}}
      aria-disabled={disabled}
      role={disabled ? "button" : undefined}
      title={disabled ? "Complete your profile to access this feature" : ""}
    >
      {icon}
      {disabled && !sidebarCollapse && (
        <IconLock size={16} className="ml-1 mr-1 shrink-0" />
      )}
      {!sidebarCollapse && label && <div>{label}</div>}
    </div>
  );

  // If disabled, don't wrap in Link
  if (disabled) {
    return (
      <li className="my-1">
        {content}
      </li>
    );
  }

  // Otherwise, render as normal link
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