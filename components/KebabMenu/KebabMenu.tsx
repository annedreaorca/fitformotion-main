"use client";
import { IconDotsVertical } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

interface NavItemProps {
    icon: JSX.Element;
    label?: string;
    href?: string;
}

interface KebabMenuProps {
    items?: NavItemProps[];
    header?: string;
    footer?: JSX.Element;
    kebabClassName?: string;
    itemClassName?: string;
    buttonLabel?: string;
    width?: string; // Add a width prop to control the menu's width
}

function NavItem({ icon, label, href }: NavItemProps) {
    return (
        <li className="my-1">
            <a
                href={href || "#"}
                className="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
                {icon}
                <div>{label}</div>
            </a>
        </li>
    );
}

export default function KebabMenu({
    items = [],
    header,
    footer,
    kebabClassName = "",
    itemClassName = "",
    buttonLabel = "Kebab Menu",
    width = "12rem",
}: KebabMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
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
        <div className="relative mb-[-6px]" ref={menuRef}>
            <button
                className="shrink-0"
                onClick={toggleMenu}
                aria-label={buttonLabel}
            >
                <IconDotsVertical size={24} className="text-black dark:text-white kebab-menu-icon" />
            </button>

            <ul className={`absolute right-0 mt-2 bg-white dark:bg-content1 border border-gray-300 dark:border-zinc-700 rounded-md shadow-lg z-50 px-1 transition-all duration-300 ease-out transform ${
                    isOpen ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
                } ${kebabClassName}`}
                style={{
                    width: width,
                    overflow: "hidden",
                }}
            >
                {header && (
                    <h4 className="border-b border-b-[#cccccc] dark:border-b-zinc-800 p-[10px]">
                        {header}
                    </h4>
                )}

                <div className="flex flex-col">
                    {items.map((item, idx) => (
                        <NavItem
                            key={idx}
                            icon={item.icon}
                            label={item.label}
                            href={item.href}
                        />
                    ))}
                </div>

                {footer && (
                    <div className="flex justify-start border-t dark:border-t-zinc-800 p-[10px]">
                        {footer}
                    </div>
                )}
            </ul>
        </div>
    );
}
