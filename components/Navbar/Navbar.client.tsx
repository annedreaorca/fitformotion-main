"use client";

import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";

import {
  IconBarbell,
  IconBodyScan,
  IconHistory,
  IconLayoutDashboard,
  IconListSearch,
} from "@tabler/icons-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarUser from "./NavbarUser";

const NAV_CONTENT_ITEMS = [
  { icon: <IconLayoutDashboard size={30} stroke={1.1} />, href: "/dashboard", label: "Dashboard" },
  { icon: <IconListSearch size={30} stroke={1.1} />, href: "/exercises", label: "Exercises" },
  { icon: <IconBarbell size={30} stroke={1.1} />, href: "/workout", label: "Start Workout" },
  { icon: <IconHistory size={30} stroke={1.1} />, href: "/activity", label: "Activity Log" },
  { icon: <IconBodyScan size={30} stroke={1.1} />, href: "/gallery", label: "Gallery" },
];

export default function MobileNavbarClient({
  username,
  userImage,
}: {
  username: string | undefined;
  userImage: string | undefined;
}) {
  const pathname = usePathname();

  return (
    <Navbar className="bg-white dark:bg-zinc-900 block md:hidden shadow-md rounded-tl-[10px] rounded-tr-[10px] mobileNav">
      {/* <NavbarContent justify="center">
        <NavbarItem>
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
            aria-label="Home Page"
          >
            <Image
              src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
              alt="Fitformotion Logo"
              className="w-8 h-8"
              width={30}
              height={30}
            />
          </Link>
        </NavbarItem>
      </NavbarContent> */}

      <NavbarContent className="gap-5" justify="center">
        {NAV_CONTENT_ITEMS.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link href={item.href} aria-label={item.label}>
              {item.icon}
            </Link>
          </NavbarItem>
        ))}
        <NavbarItem>
          <Link href="/profile">
            <NavbarUser username={username} userImage={userImage} />
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* <NavbarContent justify="center">
      </NavbarContent> */}
    </Navbar>
  );
}