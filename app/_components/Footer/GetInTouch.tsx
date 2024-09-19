"use client";

import { IconMailFilled, IconPhoneFilled } from "@tabler/icons-react"; // Import Tabler icons
import clsx from "clsx";
import Link from "next/link";

export function GetInTouch() {
    const footerLinks = [
        {
            label: "+63 968-438-2598",
            href: "tel: +63 968-438-2598",
            icon: <IconPhoneFilled size={18} />,},
        {
            label: "fitformotion.business@gmail.com",
            href: "mailto:fitformotion.business@gmail.com",
            icon: <IconMailFilled size={18} />,},
        ];
    
    return (
        <div className="flex flex-col max-[580px]:gap-[20px] gap-[15px]">
            <span className="footer-label text-center">Get In Touch</span>
            <ul className="flex max-[580px]:flex-col max-[580px]:gap-[20px] gap-[30px] footer-links">
            {footerLinks.map((item) => (
                <NavItem
                    key={item.href}
                    label={item.label}
                    href={item.href}
                    icon={item.icon}
                />
            ))}
            </ul>
        </div>
    );
}

interface FooterProps {
    label: string;
    href: string;
    icon: React.ReactNode;
}

function NavItem({ label, href, icon}: FooterProps) {
    return (
        <li className="footer-link">
            <Link
            href={href}
            className={clsx(
                "link transition-colors duration-200 ease-in-out",
                "text-zinc-600 dark:text-zinc-400 flex justify-center text-center gap-[5px]"
            )}
            >
                {icon}
                {label}
            </Link>
        </li>
    );
}
