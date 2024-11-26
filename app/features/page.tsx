import Image from "next/image";
import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";

import 'animate.css';

import { BrowseExecises, Dashboard, StartWorkout, WorkoutManager } from "../index";

export default async function Features() {
    return (
        <main>
            <Header/>
            <div className="page-heading bg-image">
                <section className="pt-[200px] pb-[75px] page-width">
                    <div className="page-heading-wrapper uppercase">
                        <h1 className="text-white inner-page-headings">Key Features</h1>
                    </div>
                </section>
            </div>
            
            <section className="py-[100px] mx-auto flex justify-center bg-black">
                <div className="flex flex-col gap-[150px] section-container page-width animate__animated animate__fadeInUp duration-1000">
                    <div className="flex items-center gap-[50px] max-[1024px]:flex-col ">
                        <div className="flex items-center justify-center gap-[15px] w-[60%] max-[1024px]:w-[100%]">
                            <Image
                                src={Dashboard}
                                alt="Fitformotion - Dashboard"
                            />
                        </div>
                        <div className="flex flex-col py-[30px] max-[1024px]:py-[0px] gap-[20px] w-[40%] max-[1024px]:w-[100%]">
                            <div className="flex justify-start">
                                <span className="section-label">Dashboard</span>
                            </div>
                            <h2 className="section-headline">See Your Progress in Motion</h2>
                            <p className="text-zinc-500 description">
                                Stay connected to your fitness progress through specialized tracking and customizable visualization tools. Providing workout summaries, trend analysis or whatever you want to know about your performance over any period of time. Most importantly, always set goals, track your progress and ensure that you acknowledge any progress made no matter how small it may be. Our analytics are not just for workouts, but for building up a better you.
                            </p>
                            {/* <div className="flex gap-3 mt-6 justify-start">
                                // For Button
                            </div> */}
                        </div>
                    </div>
                    <div className="flex flex-row-reverse items-center gap-[50px] max-[1024px]:flex-col ">
                        <div className="flex items-center justify-center gap-[15px] w-[60%] max-[1024px]:w-[100%]">
                            <Image
                                src={StartWorkout}
                                alt="Fitformotion - Start Workout"
                            />
                        </div>
                        <div className="flex flex-col py-[30px] max-[1024px]:py-[0px] gap-[20px] w-[40%] max-[1024px]:w-[100%]">
                            <div className="flex justify-start">
                                <span className="section-label">Start Workout</span>
                            </div>
                            <h2 className="section-headline">Personalized Fitness Programs</h2>
                            <p className="text-zinc-500 description">
                                Choose from our extensive collection of exercises to make personalized plans for your goals, timetable, and ability. Incorporate the changes based on your performance level while doing exercises by varying the number of sets, repetitions, and time. This level of customization means that no matter what you have in mind, achieving those goals has never been easier.
                            </p>
                            {/* <div className="flex gap-3 mt-6 justify-start">
                                // For Button
                            </div> */}
                        </div>
                    </div>
                    <div className="flex items-center gap-[50px] max-[1024px]:flex-col ">
                        <div className="flex items-center justify-center gap-[15px] w-[60%] max-[1024px]:w-[100%]">
                            <Image
                                src={BrowseExecises}
                                alt="Fitformotion - Browse Execises"
                            />
                        </div>
                        <div className="flex flex-col py-[30px] max-[1024px]:py-[0px] gap-[20px] w-[40%] max-[1024px]:w-[100%]">
                            <div className="flex justify-start">
                                <span className="section-label">Browse Exercises</span>
                            </div>
                            <h2 className="section-headline">Find Your Ideal Workout</h2>
                            <p className="text-zinc-500 description">
                                Explore a wide library of workouts complete with instructions, videos, and useful tips on how to perform all kinds of exercises. Whether your goal is to tone your body, build muscles or get flexible, we offer a variety of selection for you. You can also select according to the muscle area and choose the difficulty level or equipment so that you get a list of exercises that matches your goal. Even though Fitformotion cannot replace a personal trainer it certainly feels like having one in your device.
                            </p>
                            {/* <div className="flex gap-3 mt-6 justify-start">
                                // For Button
                            </div> */}
                        </div>
                    </div>
                    <div className="flex flex-row-reverse items-center gap-[50px] max-[1024px]:flex-col ">
                        <div className="flex items-center justify-center gap-[15px] w-[60%] max-[1024px]:w-[100%]">
                            <Image
                                src={WorkoutManager}
                                alt="Fitformotion - Workout Manager"
                            />
                        </div>
                        <div className="flex flex-col py-[30px] max-[1024px]:py-[0px] gap-[20px] w-[40%] max-[1024px]:w-[100%]">
                            <div className="flex justify-start">
                                <span className="section-label">Workout Manager</span>
                            </div>
                            <h2 className="section-headline">Record & Track your workouts</h2>
                            <p className="text-zinc-500 description">
                                Stay motivated and keep your pace by tracking workouts in real time. Any exercise in your plan? Try it out and track your progress on a daily basis – record the number of sets, reps and the weight you lift effortlessly. This feedback helps to motivate you and also makes sure that every session is productive in terms of improving your fitness goals.
                            </p>
                            {/* <div className="flex gap-3 mt-6 justify-start">
                                // For Button
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </main>
    );
}