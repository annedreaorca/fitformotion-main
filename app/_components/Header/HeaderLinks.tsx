"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderLinks() {
  const pathname = usePathname();

  const navItems = [
    {
        label: "Home",
        href: "/",
        active: pathname === "/" },
    {
        label: "Features",
        href: "/feature",
        active: pathname === "/feature" },
    {
        label: "About",
        href: "/about-us",
        active: pathname === "/about-us" },
    {
        label: "Contact",
        href: "/contact-us",
        active: pathname === "/contact-us" },
    {
        label: "FAQ",
        href: "/faqs",
        active: pathname === "/faqs" },
  ];

  return (
    <nav className="flex gap-5 items-center">
      <ul className="flex gap-5 nav-links z-[100px] max-[768px]:flex-col">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            href={item.href}
            active={item.active}
          />
        ))}
      </ul>
    </nav>
  );
}

interface NavItemProps {
  label: string;
  href: string;
  active: boolean;
}

function NavItem({ label, href, active }: NavItemProps) {
  return (
    <li className="nav-link max-[580px]:text-[20px]">
      <Link
        href={href}
        className={clsx(
          "link transition-colors duration-200 ease-in-out",
          active ? "text-white " : "text-zinc-600 "
        )}
      >
        {label}
      </Link>
    </li>
  );
}