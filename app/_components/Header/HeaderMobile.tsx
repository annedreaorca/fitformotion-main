"use client"; // Ensure this component is a Client Component

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@nextui-org/react";
import { IconBrandFacebookFilled, IconMailFilled, IconMapPinFilled, IconPhoneFilled,IconDownload, IconEye } from "@tabler/icons-react";
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
        <div className="hidden gap-[20px] max-[911px]:flex max-[630px]:flex-row-reverse">
            <div className="flex justify-start items-center w-[20%] max-[630px]:justify-end">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hamburger-menu"
                >
                    <span className={`burger burger-1 ${sidebarOpen ? 'is-closed' : ''}`}></span>
                </button>
            </div>
            <div className="flex justify-center w-[60%] items-center pr-[20px] max-[630px]:w-[80%] max-[630px]:justify-start">
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
            <div className="flex justify-end items-center gap-[20px] nav-button w-[40%] max-[1148px]:w-[20%] max-[630px]:hidden">
                <Button
                    className="bg-transparent border border-1-zinc-400 text-white max-[1148px]:min-w-[1rem] max-[1148px]:!p-[12px]"
                    as={Link}
                    prefetch={false}
                    href="/demo/dashboard"
                    size="md"
                >
                    <IconEye size={18} />
                    <p className="max-[1148px]:hidden text-white">View Demo</p>
                </Button>
                <Button
                    className="bg-primary-800 text-white max-[1148px]:min-w-[1rem] max-[1148px]:!p-[12px] max-[1148px]:!p-[12px]"
                    as={Link}
                    prefetch={false}
                    href="https://app.fitformotion.com"
                    size="md"
                >
                    <IconDownload size={18} className="!w-[20px] !h-[20px]" />
                    <p className="max-[1148px]:hidden text-white">Install Now</p>
                </Button>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="flex flex-col w-full h-screen gap-[20px] max-[580px]:gap-[20px] py-[25px] px-[40px]">
                    <div className="flex justify-end max-[630px]:justify-start">
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
                    <div className="mt-[50px] max-[630px]:mt-[30px]">
                        <HeaderLinks />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 mb-[50px] flex flex-col item-center gap-[40px]">
                        <div className="flex flex-col justify-center items-center gap-[20px] nav-button min-[630px]:hidden">
                            <Button
                                className="bg-primary-800 text-white"
                                as={Link}
                                prefetch={false}
                                href="https://app.fitformotion.com"
                                size="md"
                            >
                                <IconDownload size={18} />
                                <p className="text-white">Install Now</p>
                            </Button>
                            <Button
                                className="bg-transparent border border-1-zinc-400 text-white max-[1148px]:min-w-[1rem]"
                                as={Link}
                                prefetch={false}
                                href="/demo/dashboard"
                                size="md"
                            >
                                <IconEye size={18} />
                                <p className="text-white">View Demo</p>
                            </Button>
                        </div>
                        <div className="flex gap-5 justify-center">
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
