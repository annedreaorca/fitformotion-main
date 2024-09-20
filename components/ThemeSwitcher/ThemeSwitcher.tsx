"use client";
import { useSidebarToggleContext } from "@/contexts/SidebarToggleContext";
import {
  IconDeviceDesktop,
  IconMoonStars,
  IconSunHigh,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { sidebarCollapse } = useSidebarToggleContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const setThemes = [
    { name: "light",
      icon: <IconSunHigh size={20} />,
      label: "Light theme",
      title: "Light Mode", },
    { 
      name: "dark",
      icon: <IconMoonStars size={20} />,
      label: "Dark theme",
      title: "Dark Mode", },
    {
      name: "system",
      icon: <IconDeviceDesktop size={20} />,
      label: "System theme",
      title: "System Default", },
  ];

  const styles = {
    button_bg_primary_800: {
      backgroundColor: "#991b1b",
    },
  };

  return (
    <>
      {!sidebarCollapse && (
        <div className="flex gap-1">
          {setThemes.map(({ name, icon, label, title }) => (
            <button
              key={name}
              aria-label={label}
              onClick={() => setTheme(name)}
              className={clsx(
                "dark:hover:bg-zinc-800 hover:bg-zinc-200 p-2 rounded-full relative group",
                {
                  "text-black dark:text-primary text-white bg-primary": theme === name,
                  button_bg_primary_800: theme === name,
                }
              )}
              style={theme === name ? styles.button_bg_primary_800 : {}}
            >
              {icon}
              {/* Custom tooltip */}
              <span className="tooltip-text">{title}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
