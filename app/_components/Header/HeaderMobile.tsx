"use client";  // Ensure this component is a Client Component

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@nextui-org/react";
import { HeaderLinks } from "./HeaderLinks";

export function HeaderMobile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [sidebarOpen]);

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
            <div className='flex justify-end items-center nav-button w-[20%]'>
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
                <div className="flex flex-col h-screen gap-[20px] mt-[100px] max-[580px]:gap-[20px] p-[35px]">
                    <HeaderLinks />
                </div>
            </div>
        </div>
    );
}