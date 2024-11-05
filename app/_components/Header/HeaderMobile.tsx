"use client"; // Ensure this component is a Client Component

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@nextui-org/react";
import { IconBrandFacebookFilled, IconMailFilled, IconMapPinFilled, IconPhoneFilled } from "@tabler/icons-react";
import { HeaderLinks } from "./HeaderLinks";

export function HeaderMobile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
    }, [sidebarOpen]);

    const socialLinks = [
        { href: "https://www.facebook.com/fitformotionapp", icon: IconBrandFacebookFilled },
        { href: "mailto:fitformotion.business@gmail.com", icon: IconMailFilled },
        { href: "tel: +63 968-438-2598", icon: IconPhoneFilled },
        { href: "https://www.google.com/maps/search/%239+Aguinaldo+St.+New+Asinan,+Olongapo+City,+Zambales,+Philippines+2200/@14.8228253,120.279878,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI0MTAwMi4xIKXMDSoASAFQAw%3D%3D", icon: IconMapPinFilled },
    ];

    return (
        <div className="hidden gap-[20px] max-[768px]:flex mobile-menu">
            <div className="flex justify-start items-center w-[20%]">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hamburger-menu"
                >
                    <span className={`burger burger-1 ${sidebarOpen ? 'is-closed' : ''}`}></span>
                </button>
            </div>
            <div className="flex justify-center w-[60%] items-center pr-[20px]">
                <a href="/">
                    <Image
                        src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
                        alt="Fitformotion Logo"
                        className="w-[50px] h-[50px]"
                        width={50}
                        height={50}
                    />
                </a>
            </div>
            <div className="flex justify-end items-center nav-button w-[20%]">
                <Button
                    className="bg-primary-800 text-white"
                    as={Link}
                    prefetch={false}
                    href="/dashboard"
                    size="md"
                >
                    Login
                </Button>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="flex flex-col w-full h-screen gap-[20px] max-[580px]:gap-[20px] py-[25px] px-[40px]">
                    <div className="flex justify-end">
                        <a href="/" className="z-[1]">
                            <Image
                                src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
                                alt="Fitformotion Logo"
                                className="w-[40px] h-[40px]"
                                width={50}
                                height={50}
                            />
                        </a>
                    </div>
                    <div className="mt-[50px]">
                        <HeaderLinks />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 mb-5 flex justify-center">
                        <div className="flex gap-5">
                            {socialLinks.map(({ href, icon: Icon }, index) => (
                                <Link key={index} href={href} className="text-zinc-600 hover:text-white">
                                    <Icon size={24} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
