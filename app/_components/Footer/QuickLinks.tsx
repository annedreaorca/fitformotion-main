"use client";

import clsx from "clsx";
import Link from "next/link";

export function QuickLinks() {
    const footerLinks = [
        {
            label: "Home",
            href: "/",},
        {
            label: "Features",
            href: "/features",},
        {
            label: "Pricing",
            href: "/pricing",},
        {
            label: "About",
            href: "/about-us", },
        {
            label: "FAQ",
            href: "/faq",},
        {
            label: "References",
            href: "/references",},
    ];

    return (
        <div className="flex flex-col gap-[25px] max-[580px]:gap-[20px]">
            <span className="footer-label max-[640px]:text-center">Quick Links</span>
            <ul className="flex flex-col max-[580px]:gap-[20px] gap-[18px] max-[640px]:text-center footer-links">
            {footerLinks.map((item) => (
                <NavItem
                    key={item.href}
                    label={item.label}
                    href={item.href}
                />
            ))}
            </ul>
        </div>
    );
}

interface FooterProps {
    label: string;
    href: string;
}

function NavItem({ label, href}: FooterProps) {
    return (
        <li className="footer-link">
            <Link
            href={href}
            className={clsx(
                "link transition-colors duration-200 ease-in-out",
                "text-zinc-600 max-[640px]:text-center"
            )}
            >
            {label}
            </Link>
        </li>
    );
}
