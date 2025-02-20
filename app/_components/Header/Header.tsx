"use client";

import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from 'next/link';
import { HeaderLinks } from "./HeaderLinks";
import { HeaderMobile } from "./HeaderMobile";

export default function Header() {
    return (
        <header className="mb-[-100px] py-[12px] relative z-[999999] page-width">
            <div className="flex gap-[20px] max-[911px]:hidden desktop-menu">
                <div className="flex gap-[50px] justify-start w-[60%] max-[1148px]:w-[80%] items-center">
                    <a href="/">
                        <Image
                            src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
                            alt="Fitformotion Logo"
                            className="w-[65px] h-[65px]"
                            width={50}
                            height={50}
                        />
                    </a>
                    <HeaderLinks />
                </div>
                <div className="flex justify-end items-center gap-[20px] nav-button w-[40%] max-[1148px]:w-[20%]">
                    {/* <Button
                        className="bg-transparent border border-1-zinc-400 text-white max-[1148px]:min-w-[1rem] max-[1148px]:!p-[12px]"
                        as={Link}
                        prefetch={false}
                        href="/demo/dashboard"
                        size="md"
                    >
                        <IconEye size={18} />
                        <p className="max-[1148px]:hidden text-white">View Demo</p>
                    </Button> */}
                    <Button
                        className="bg-primary-800 text-white max-[1148px]:min-w-[1rem] max-[1148px]:!p-[12px]"
                        as={Link}
                        prefetch={false}
                        href="#"
                        // href="https://app.fitformotion.com"
                        size="md"
                        disabled
                    >
                        {/* <IconDownload size={18} /> */}
                        <p className="max-[1148px]:hidden text-white">App Coming Soon</p>
                    </Button>
                </div>
            </div>
            <HeaderMobile />
        </header>
    );
}
