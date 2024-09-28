"use client";

import { IconBrandFacebookFilled, IconMailFilled, IconPhoneFilled } from "@tabler/icons-react"; // Import Tabler icons
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
        {
            label: "facebook",
            href: "https://www.facebook.com/fitformotionapp",
            icon: <IconBrandFacebookFilled size={18} />,},
        ];
    
    return (
        <div className="flex flex-col gap-[20px]">
            <span className="footer-label max-[640px]:text-center">Get In Touch</span>
            <ul className="flex flex-col gap-[18px] max-[640px]:gap-[20px] max-[640px]:items-center footer-links">
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
                "text-zinc-600 flex max-[640px]:justify-center max-[640px]:text-center gap-[5px]"
            )}
            >
                {icon}
                {label}
            </Link>
        </li>
    );
}
