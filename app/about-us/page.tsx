"use-client"

import { Hacker, Hipster, Hustler } from "@/app/index";
import Image from "next/image";
import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";
import ComingSoon from "../_components/UnderMaintenance/UnderMaintenance";

export default async function AboutUs() {
    return (
        <main>
            <Header/>
            <section className="page-heading bg-image">
                <div className="pt-[200px] pb-[75px] page-width">
                    <div className="page-heading-wrapper uppercase">
                        <h1 className="text-white inner-page-headings">About Us</h1>
                    </div>
                </div>
            </section>
            <section className="bg-black">
                <div className="flex flex-col gap-[40px] py-[75px] page-width">
                    <div className="flex flex-col items-center gap-[20px]">
                        <div className="flex justify-center">
                            <span className="section-label text-center">Our Team</span>
                        </div>
                        <h2 className="section-headline text-center">Meet Trifecta Proximity</h2>
                        <p className="text-zinc-500 description text-center">Meet the passionate team behind the app, dedicated to helping you achieve your fitness goals through personalized workouts and insightful progress tracking</p>
                    </div>
                    <div className="profiles-wrapper">
                        <div className="flex gap-[20px] max-[580px]:flex-col profiles-container">
                            <div className="h-[450px] rounded-[10px] bg-[#080808] border-1 border-zinc-900 relative overflow-hidden profile-item">
                                <Image
                                    src={Hustler}
                                    alt="Mahasiah Bautista - Hustler"
                                    className="grayscale hover:grayscale-0 transition-all duration-300 profile-image object-cover h-[450px] w-full"
                                />
                                <div className="p-[10px] z-[2] profile-info">
                                    <div className="flex flex-col gap-[10px] p-[10px] rounded-[10px] profile-content">
                                        <div className="flex justify-start">
                                            <span className="profile-title">Hustler</span>
                                        </div>
                                        <div>
                                            <h3>Mahasiah Bautista</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Gradient overlay */}
                                <div className="absolute z-[1] inset-0 bg-gradient-to-t from-[#000000fb] via-[#00000042] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 gradient-overlay"></div>
                            </div>

                            <div className="h-[450px] relative overflow-hidden rounded-[10px] bg-[#080808] border-1 border-zinc-900 profile-item">
                                <Image
                                    src={Hipster}
                                    alt="Christian Jay Cuya - Hipster"
                                    className="grayscale hover:grayscale-0 transition-all duration-300 profile-image object-cover h-[450px] w-full"
                                />
                                <div className="p-[10px] z-[2] profile-info">
                                    <div className="flex flex-col gap-[10px] p-[10px] rounded-[10px] profile-content">
                                        <div className="flex justify-start">
                                            <span className="profile-title">Hipster</span>
                                        </div>
                                        <div>
                                            <h3>Christian Jay Cuya</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute z-[1] inset-0 bg-gradient-to-t from-[#000000fb] via-[#00000042] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 gradient-overlay"></div>
                            </div>

                            <div className="h-[450px] relative overflow-hidden rounded-[10px] bg-[#080808] border-1 border-zinc-900 profile-item">
                                <Image
                                    src={Hacker}
                                    alt="Andrea Anne Orca - Hacker"
                                    className="grayscale hover:grayscale-0 transition-all duration-300 profile-image object-cover h-[450px] w-full"
                                />
                                <div className="p-[10px] z-[2] profile-info">
                                    <div className="flex flex-col gap-[10px] p-[10px] rounded-[10px] profile-content">
                                        <div className="flex justify-start">
                                            <span className="profile-title">Hacker</span>
                                        </div>
                                        <div>
                                            <h3>Andrea Anne Orca</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute z-[1] inset-0 bg-gradient-to-t from-[#000000fb] via-[#00000042] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 gradient-overlay"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ComingSoon/>
            <Footer/>
        </main>
    );
}