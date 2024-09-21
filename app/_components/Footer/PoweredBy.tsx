"use client";

import Image from "next/image";

export function PoweredBy() {
    return (
        <div className="flex flex-col max-[580px]:gap-[20px] gap-[20px]">
            <span className="footer-label text-center">Powered By</span>
            <div className="flex  max-[580px]:gap-[20px] gap-[30px] footer-links">
                <a href="https://nextjs.org/" className="opacity-35 transition duration-150 ease-out hover:ease-in hover:opacity-hover">
                    <Image
                        src="/images/powered-by-logos/next-js-logo.svg"
                        alt="Fitformotion Logo"
                        className="w-[35px] h-[35px]"
                        width={50}
                        height={50}
                    />
                </a>
                <a href="https://vercel.com/" className="opacity-35 transition duration-150 ease-out hover:ease-in hover:opacity-hover">
                    <Image
                        src="/images/powered-by-logos/vercel-logo.svg"
                        alt="Fitformotion Logo"
                        className="w-[35px] h-[35px]"
                        width={50}
                        height={50}
                    />
                </a>
                <a href="https://clerk.com/" className="opacity-35 transition duration-150 ease-out hover:ease-in hover:opacity-hover">
                    <Image
                        src="/images/powered-by-logos/clerk-logo.svg"
                        alt="Fitformotion Logo"
                        className="w-[35px] h-[35px]"
                        width={50}
                        height={50}
                    />
                </a>
                <a href="https://tailwindcss.com/" className="opacity-35 transition duration-150 ease-out hover:ease-in hover:opacity-hover">
                    <Image
                        src="/images/powered-by-logos/tailwind-css-logo.svg"
                        alt="Fitformotion Logo"
                        className="w-[35px] h-[35px]"
                        width={50}
                        height={50}
                    />
                </a>
            </div>
        </div>
    );
}