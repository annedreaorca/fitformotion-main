"use client";

import clsx from "clsx";
import Link from "next/link";

export function LegalLinks() {
    const footerLinks = [
        {
            label: "Terms of Service",
            href: "/terms-of-service",},
        {
            label: "Privacy Policy",
            href: "/privacy-policy",},
    ];

    return (
        <div className="flex flex-col gap-[25px] max-[580px]:gap-[20px]">
            <ul className="flex gap-[20px] justify-center text-center">
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
                "text-zinc-600 !text-[14px] max-[640px]:text-center"
            )}
            >
            {label}
            </Link>
        </li>
    );
}
