"use client";
import {
    IconDotsVertical,
    IconSettings,
    IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface NavItemProps {
    icon: JSX.Element;
    label?: string;
    href?: string;
    active: boolean;
}

function NavItem({ icon, label, href, active }: NavItemProps) {
    return (
        <li className="my-1">
        <Link
            href={href || "#"}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ease-in-out ${
            active
                ? "bg-zinc-300 text-black dark:text-primary text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-800"
            }`}
        >
            {icon}
            <div>{label}</div>
        </Link>
        </li>
    );
}

export default function KebabMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    // Close menu on clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
        <button
            className="shrink-0"
            onClick={toggleMenu}
            aria-label="Kebab Menu"
        >
            <IconDotsVertical size={22} className="text-black dark:text-primary" />
        </button>

        {isOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 px-5 duration-500 ease-in-out ">
            <NavItem
                icon={<IconUser size={22} className="shrink-0" />}
                label="Profile"
                href="/profile"
                active={pathname === "/profile"}
            />
            <NavItem
                icon={<IconSettings size={22} className="shrink-0" />}
                label="Settings"
                href="/profile/advanced"
                active={pathname.startsWith("/profile/advanced")}
            />
            </ul>
        )}
        </div>
    );
}