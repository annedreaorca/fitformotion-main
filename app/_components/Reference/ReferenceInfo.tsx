import { Dot } from "@/app/index";
import 'animate.css';
import Image from "next/image";
import Link from "next/link";

export default async function ReferencesInfo() {
    return (
        <div className="animate__animated animate__fadeInUp duration-1000">
            {/* Front-end */}
            <div className="flex items-center ">
                <div className="relative">
                    <div className="w-[40px] bullet-list-custom-first">
                        <Image
                            src={Dot}
                            alt="Bullet Icon"
                            className="bullet-icon-custom"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 ml-[20px] p-[40px] max-[510px]:p-[25px] bg-zinc-950 rounded-[20px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="section-headline max-[510px]:!text-[22px]">Next.js</h2>
                        <p className="text-zinc-500 description">An open public domain exercise dataset in JSON format, featuring over 800 exercises with a browsable and searchable frontend.</p>
                    </div>
                    <div>
                        <Link href="https://nextjs.org/docs" rel="noopener noreferrer" target="_blank">
                            <span className="text-zinc-600 hover:text-primary-800 duration-200 ease-in-out">View on Next.js</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="relative">
                    <div className="w-[40px] bullet-list-custom-last">
                        <Image
                            src={Dot}
                            alt="Bullet Icon"
                            className="bullet-icon-custom"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 ml-[20px] p-[40px] max-[510px]:p-[25px] bg-zinc-950 rounded-[20px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="section-headline max-[510px]:!text-[22px]">Tailwind CSS</h2>
                        <p className="text-zinc-500 description">An open public domain exercise dataset in JSON format, featuring over 800 exercises with a browsable and searchable frontend.</p>
                    </div>
                    <div>
                        <Link href="https://tailwindcss.com/docs/installation" rel="noopener noreferrer" target="_blank">
                            <span className="text-zinc-600 hover:text-primary-800 duration-200 ease-in-out">View on Tailwind CSS</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Back-end & Database*/}
            <div className="flex items-center">
                <div className="relative">
                    <div className="w-[40px] bullet-list-custom-first">
                        <Image
                            src={Dot}
                            alt="Bullet Icon"
                            className="bullet-icon-custom"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 ml-[20px] p-[40px] max-[510px]:p-[25px] bg-zinc-950 rounded-[20px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="section-headline max-[510px]:!text-[22px]">Clerk</h2>
                        <p className="text-zinc-500 description">Documentation for Clerk, the authentication service used in Fitformotion for managing user accounts and securing access to the app.</p>
                    </div>
                    <div>
                        <Link href="https://clerk.com/docs" rel="noopener noreferrer" target="_blank">
                            <span className="text-zinc-600 hover:text-primary-800 duration-200 ease-in-out">View on Clerk</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="relative">
                    <div className="w-[40px] bullet-list-custom">
                        <Image
                            src={Dot}
                            alt="Bullet Icon"
                            className="bullet-icon-custom"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 ml-[20px] p-[40px] max-[510px]:p-[25px] bg-zinc-950 rounded-[20px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="section-headline max-[510px]:!text-[22px]">Prisma</h2>
                        <p className="text-zinc-500 description">Official documentation for Prisma, an open-source database toolkit that simplifies database access and management with a type-safe ORM for Node.js and TypeScript applications.</p>
                    </div>
                    <div>
                        <Link href="https://www.prisma.io/docs" rel="noopener noreferrer" target="_blank">
                            <span className="text-zinc-600 hover:text-primary-800 duration-200 ease-in-out">View on Prisma</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="relative">
                    <div className="w-[40px] bullet-list-custom-last">
                        <Image
                            src={Dot}
                            alt="Bullet Icon"
                            className="bullet-icon-custom"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 ml-[20px] p-[40px] max-[510px]:p-[25px] bg-zinc-950 rounded-[20px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="section-headline max-[510px]:!text-[22px]">PostgreSQL</h2>
                        <p className="text-zinc-500 description">Official documentation for PostgreSQL, a powerful, open-source object-relational database system known for its reliability, feature robustness, and performance.</p>
                    </div>
                    <div>
                        <Link href="https://www.postgresql.org/docs/" rel="noopener noreferrer" target="_blank">
                            <span className="text-zinc-600 hover:text-primary-800 duration-200 ease-in-out">View on PostgreSQL</span>
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Hosting side */}
            <div className="flex items-center">
                <div className="relative">
                    <div className="w-[40px] bullet-list-custom-first">
                        <Image
                            src={Dot}
                            alt="Bullet Icon"
                            className="bullet-icon-custom"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 ml-[20px] p-[40px] max-[510px]:p-[25px] bg-zinc-950 rounded-[20px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="section-headline max-[510px]:!text-[22px]">Vercel</h2>
                        <p className="text-zinc-500 description">Documentation for the Vercel platform, which hosts the Fitformotion web app, enabling fast deployments and serverless functions.
                        </p>
                    </div>
                    <div>
                        <Link href="https://vercel.com/docs" rel="noopener noreferrer" target="_blank">
                            <span className="text-zinc-600 hover:text-primary-800 duration-200 ease-in-out">View on Vercel</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="relative">
                    <div className="w-[40px] bullet-list-custom-last">
                        <Image
                            src={Dot}
                            alt="Bullet Icon"
                            className="bullet-icon-custom"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 ml-[20px] p-[40px] max-[510px]:p-[25px] bg-zinc-950 rounded-[20px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="section-headline max-[510px]:!text-[22px]">Hostinger</h2>
                        <p className="text-zinc-500 description">Guides and documentation for Hostinger, the service provider from which the domain for Fitformotion was purchased.</p>
                    </div>
                    <div>
                        <Link href="https://www.hostinger.ph/tutorials/" rel="noopener noreferrer" target="_blank">
                            <span className="text-zinc-600 hover:text-primary-800 duration-200 ease-in-out">View on Hostinger</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center">
                <div className="relative">
                    <div className="w-[40px] bullet-list-custom-none">
                        <Image
                            src={Dot}
                            alt="Bullet Icon"
                            className="bullet-icon-custom"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 ml-[20px] p-[40px] max-[510px]:p-[25px] bg-zinc-950 rounded-[20px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="section-headline max-[510px]:!text-[22px]">Xendit Payment Gateway</h2>
                        <p className="text-zinc-500 description">Comprehensive documentation for the Xendit API, which offers payment processing solutions and features for managing online transactions, integrated within the Fitformotion platform.</p>
                    </div>
                    <div>
                        <Link href="https://developers.xendit.co/api-reference/" rel="noopener noreferrer" target="_blank">
                            <span className="text-zinc-600 hover:text-primary-800 duration-200 ease-in-out">View on Xendit</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}