"use-client"

import { Hacker, Hipster, Hustler, ProjectAdviser, ProjectBeneficiary } from "@/app/index";
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import Image, { StaticImageData } from "next/image";
import 'animate.css';
import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";


// Define props type for ProfileCard component
interface ProfileCardProps {
    imageSrc: StaticImageData;
    altText: string;
    title: string;
    secondaryTitle: string;
    name: string;
    description: string;
    facebook?: string;
    instagram?: string;
}

export default async function AboutUs() {
    const team = [
        {
            imageSrc: Hustler,
            altText: "Mahasiah Bautista - Hustler",
            title: "Hustler",
            secondaryTitle: "Team Leader",
            name: "Mahasiah Bautista",
            description: "His leadership and relentless work ethic keep the team motivated and focused on success.",
            facebook: "https://www.facebook.com/siahbautista",
            instagram: "https://www.instagram.com/haisaham"
        },
        {
            imageSrc: Hacker,
            altText: "Andrea Anne Orca - Hacker",
            title: "Hacker",
            secondaryTitle: "Lead Developer",
            name: "Andrea Anne Orca",
            description: "Her technical expertise and problem-solving skills are crucial in building and maintaining the platforms core functionalities.",
            facebook: "https://www.facebook.com/aa.orca",
            instagram: "https://www.instagram.com/aa.orcs/"
        },
        {
            imageSrc: Hipster,
            altText: "Christian Jay Cuya - Hipster",
            title: "Hipster",
            secondaryTitle: "Lead Designer",
            name: "Christian Jay Cuya",
            description: "His innovative approach ensures that our platform is both aesthetically pleasing and highly usable.",
            facebook: "https://www.facebook.com/christianjay.cuya.90/",
            instagram: "https://www.instagram.com/cjaycuya/"
        }
    ];

    return (
        <main>
            <Header />
            <section className="page-heading bg-image">
                <div className="pt-[200px] pb-[75px] page-width">
                    <div className="page-heading-wrapper uppercase">
                        <h1 className="text-white inner-page-headings">About Us</h1>
                    </div>
                </div>
            </section>
            <section className="flex flex-col gap-[200px] bg-black py-[100px]">
                <div className="flex flex-col gap-[40px] page-width animate__animated animate__fadeInUp duration-1000">
                    <div className="flex flex-col items-center gap-[20px]">
                        <div className="flex justify-center">
                            <span className="section-label text-center">Our Team</span>
                        </div>
                        <h2 className="section-headline text-center">Meet Trifecta Proximity</h2>
                        <p className="text-zinc-500 description text-center">Meet the passionate team behind the app, dedicated to helping you achieve your fitness goals through personalized workouts and insightful progress tracking.</p>
                    </div>
                    <div className="profiles-wrapper">
                        <div className="flex gap-[20px] max-[580px]:flex-col profiles-container">
                            {team.map((member, index) => (
                                <ProfileCard
                                    key={index}
                                    imageSrc={member.imageSrc}
                                    altText={member.altText}
                                    title={member.title}
                                    secondaryTitle={member.secondaryTitle}
                                    name={member.name}
                                    description={member.description}
                                    facebook={member.facebook}
                                    instagram={member.instagram}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-[200px]  section-container page-width">
                    <div className="flex items center gap-[50px] max-[580px]:flex-col items-center">
                        <div className="flex items-center justify-center gap-[15px] w-[40%] max-[580px]:w-[100%]">
                            <Image
                                src={ProjectAdviser}
                                alt="Mr. Arvin Shelby De Leon - Project Adviser"
                            />
                        </div>
                        <div className="flex flex-col py-[30px] max-[580px]:py-[0px] gap-[20px] w-[60%] max-[580px]:w-[100%]">
                            <div className="flex justify-start">
                                <span className="section-label">Project Adviser</span>
                            </div>
                            <div>
                                <h2 className="section-headline">Mr. Arvin Shelby De Leon</h2>
                                <span className="text-[24px] font-medium text-zinc-400">Solutions Architect</span>
                            </div>
                            <p className="text-zinc-500 description">
                                Mr. Arvin Shelby De Leon earned his Bachelor&apos;s degree in Computer Science in 2016, receiving the Best Thesis award and being named Programmer of the Year. In 2020, he completed his Master&apos;s degree in Computer Science at Ramon Magsaysay Technological University, now known as President Ramon Magsaysay State University (PRMSU). With over 8 years of industry experience, Mr. De Leon currently serves as a Solutions Architect at Revdojo, where he provides recommendations and roadmaps for technical solutions, offers strategic guidance, and oversees project lifecycles. As the Project Adviser, his extensive expertise ensures that the technical strategies and implementation throughout the project are efficient and well-structured, guiding us toward success.
                            </p>
                            {/* <div className="flex gap-3 mt-6 justify-start">
                                // For Button
                            </div> */}
                        </div>
                    </div>
                    <div className="flex items center flex-row-reverse gap-[50px] max-[580px]:flex-col items-center">
                        <div className="flex items-center justify-center gap-[15px] w-[40%] max-[580px]:w-[100%]">
                            <Image
                                src={ProjectBeneficiary}
                                alt="Mr. Arvin Shelby De Leon - Project Adviser"
                            />
                        </div>
                        <div className="flex flex-col py-[30px] gap-[20px] w-[60%] max-[580px]:w-[100%] max-[580px]:py-[0px]">
                            <div className="flex justify-start">
                                <span className="section-label">Project Beneficiary </span>
                            </div>
                            <div>
                                <h2 className="section-headline">Mr. Matthew John Barcelon</h2>
                                <span className="text-[24px] font-medium text-zinc-400">Amateur Fitness Instructor</span>
                            </div>
                            <p className="text-zinc-500 description">
                                As the Project Beneficiary, Mr. Barcelon offers valuable insights and feedback from a fitness coach&apos;s perspective. Known as &quot;Coach Bars&quot; by his students, Mr. Barcelon has been teaching swimming classes for about five years with the New Wave Swim Team. A lifelong fitness enthusiast, he is also an amateur fitness instructor actively pursuing certification. His goal is to share his knowledge of overall physical fitness through scientifically proven methods, while promoting the joy, positivity, and sense of fulfillment that come with leading a fit and healthy lifestyle. His hands-on experience and passion for fitness help shape the project to better meet the needs of both fitness enthusiasts and beginners alike.
                            </p>
                            {/* <div className="flex gap-3 mt-6 justify-start">
                                // For Button
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}

function ProfileCard({ imageSrc, altText, title, name, description, secondaryTitle, facebook, instagram }: ProfileCardProps) {
    return (
        <div className="h-[520px] relative overflow-hidden rounded-[10px] bg-[#080808] border border-zinc-900 profile-item">
            <Image
                src={imageSrc}
                alt={altText}
                className="grayscale hover:grayscale-0 transition-all duration-300 profile-image object-cover h-full w-full"
            />
            <div className="absolute inset-0 bg-custom-gradient opacity-0 hover:opacity-100 transition-opacity duration-300 gradient-overlay"></div>
            <div className="p-[10px] z-[2] profile-info">
                <div className="flex flex-col gap-[10px] px-[20px] rounded-[10px] profile-content">
                    <div className="flex justify-start">
                        <span className="profile-title">{title}</span>
                    </div>
                    <div className="pt-[10px] profile-details">
                        <div className="pl-[10px] border-l border-l-zinc-500">
                            <div className="flex flex-col pl-[10px] gap-[2px]">
                                <div className="flex flex-col gap-[8px]">
                                    <h3 className="text-[20px] leading-[15px]">{name}</h3>
                                    <span className="text-[14px] text-zinc-500">{secondaryTitle}</span>
                                </div>
                                <p className="text-[12px] mt-[10px] mb-[-5px] leading-[20px] text-zinc-400">{description}</p>
                            </div>
                        </div>
                        <div className="mt-[20px] flex gap-[10px]">
                            {facebook && (
                                <div className="p-[5px] rounded bg-zinc-800 duration-300 hover:bg-zinc-700">
                                    <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors duration-300">
                                        <IconBrandFacebook size={20} className="transition-transform duration-300 transform hover:scale-110" />
                                    </a>
                                </div>
                            )}
                            {instagram && (
                                <div className="p-[5px] rounded bg-zinc-800 duration-300 hover:bg-zinc-700">
                                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors duration-300">
                                        <IconBrandInstagram size={20} className="transition-transform duration-300 transform hover:scale-110" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
