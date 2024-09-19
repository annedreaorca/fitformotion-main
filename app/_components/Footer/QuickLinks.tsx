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
            label: "About",
            href: "/about-us", },
        {
            label: "Contact",
            href: "/contact-us", },
        {
            label: "FAQ",
            href: "/faq",},
        {
            label: "References",
            href: "/references",},
    ];

    return (
        <div className="flex flex-col gap-[19px] max-[580px]:gap-[20px]">
            <span className="footer-label text-center">Quick Links</span>
            <ul className="flex max-[580px]:flex-col max-[580px]:gap-[20px] gap-[30px] footer-links text-center ">
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
                "text-zinc-600 text-center"
            )}
            >
            {label}
            </Link>
        </li>
    );
}
