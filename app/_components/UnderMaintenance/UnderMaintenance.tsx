import { Button } from "@nextui-org/button";
import {
    IconChevronLeft
} from "@tabler/icons-react";

import Link from "next/link";

export default function UnderMaintenance() {
    return (
        <div className="relative py-[200px] z-40 bg-[#000000] overflow-hidden">
            <div className="falling-lines">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className="flex flex-col gap-5 relative z-10 page-width">
                <h2 className="text-center section-headline uppercase font-bold text-[#ccc]">
                    Under Maintenance
                </h2>
                <p className="text-center">
                    This page is currently under maintenance. Please check back later.
                </p>
                <div className="flex gap-3 mt-[20px] justify-center">
                    <Button
                        className="bg-primary-800 text-white"
                        as={Link}
                        prefetch={false}
                        href="/"
                        size="md"
                    >
                        <IconChevronLeft size={18} />
                        Back to Homepage
                    </Button>
                </div>
            </div>
        </div>
    );
}