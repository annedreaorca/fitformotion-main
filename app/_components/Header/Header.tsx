import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from 'next/link';
import { HeaderLinks } from "./HeaderLinks";

export default async function Header() {
    return (
        <header className="mb-[-100px] py-[12px] relative z-[999999] page-width">
            <div className="flex gap-[20px]">
                <div className="flex justify-start w-[20%] items-center">
                    <a href="/">
                        <Image
                            src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
                            alt="Fitformotion Logo"
                            className="w-[65px] h-[65px]"
                            width={50}
                            height={50}
                        />
                    </a>
                </div>
                <div className="flex justify-center items-center w-[60%]">
                    <HeaderLinks />
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
            </div>
        </header>
    );
}