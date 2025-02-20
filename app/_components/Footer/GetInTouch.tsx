"use client";

import {
    IconBrandFacebookFilled,
    IconMailFilled,
    IconMapPinFilled,
    IconPhoneFilled
} from "@tabler/icons-react";

import clsx from "clsx";
import Link from "next/link";

export function GetInTouch() {
    const footerLinks = [
        {
            label: "#9 Aguinaldo St. New Asinan, Olongapo City, Zambales, Philippines 2200",
            href: "https://www.google.com/maps/search/%239+Aguinaldo+St.+New+Asinan,+Olongapo+City,+Zambales,+Philippines+2200/@14.8228253,120.279878,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI0MTAwMi4xIKXMDSoASAFQAw%3D%3D",
            icon: <IconMapPinFilled width={40} height={40} />,},
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
        <div className="flex flex-col gap-[25px]">
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
