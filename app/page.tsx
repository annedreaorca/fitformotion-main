import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  IconBarbell,
  IconChartHistogram,
  IconClipboardData,
  IconPlayerPlayFilled,
  IconUserScan,
} from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";

import { MockupFitformotion } from "./index";

export default function Home() {
  const cardData = [
    {
      icon: IconBarbell,
      title: "Find Your Ideal Workout",
      body: "Explore a wide library of workouts complete with instructions, videos, and useful tips on how to perform all kinds of exercises. Whether your goal is to tone your body, build muscles or get flexible, we offer a variety of selection for you. You can also select according to the muscle area and choose the difficulty level or equipment so that you get a list of exercises that matches your goal. Even though Fitformotion cannot replace a personal trainer it certainly feels like having one in your pocket.",
      className: "",
    },
    {
      icon: IconUserScan,
      title: "Personalized Fitness Programs",
      body: "Choose from our extensive collection of exercises to make personalized plans for your goals, timetable, and ability. Incorporate the changes based on your performance level while doing exercises by varying the number of sets, repetitions, and time. This level of customization means that no matter what you have in mind, achieving those goals has never been easier.",
    },
    {
      icon: IconClipboardData,
      title: "Record & Track your workouts",
      body: "Stay motivated and keep your pace by tracking workouts in real time. Any exercise in your plan? Try it out and track your progress on a daily basis – record the number of sets, reps and the weight you lift effortlessly. This feedback helps to motivate you and also makes sure that every session is productive in terms of improving your fitness goals.",
    },
    {
      icon: IconChartHistogram,
      title: "See Your Progress in Motion",
      body: "Stay connected to your fitness progress through specialized tracking and customizable visualization tools. Providing workout summaries, trend analysis or whatever you want to know about your performance over any period of time. Most importantly, always set goals, track your progress and ensure that you acknowledge any progress made no matter how small it may be. Our analytics are not just for workouts, but for building up a better you.",
    },
  ];

  const styles = {
    text_red: {
      color: "#991b1b",
    },
    button_bg_primary_800: {
      backgroundColor: "#991b1b",
    },
    negative_mt: {
      marginTop: "-10px",
    },
  };

  const currentYear = new Date().getFullYear();

  return (
    <main className="bg-cover bg-center h-screen bg-gradient-to-r from-[#0c0c0c] to-[#1a1a1a]">
      <nav className="px-3 md:px-10 py-3 mb-5 flex justify-center items-center pt-6">
        <h4 className="flex items-center text-2xl gap-2 font-semibold tracking-tight uppercase justify-center text-zinc-400">
          <Image
            src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
            alt="Fitformotion Logo"
            className="w-10 h-10"
            width={40}
            height={40}
          />
          Fitformotion
        </h4>
      </nav>

      <section className="my-10 py-10 px-3 max-md:px-[30px] max-md:mt-[-30px] max-w-screen-2xl mx-auto flex justify-center">
        <div className="grid grid-cols-1 gap-5 py-20">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-5xl md:text-6xl xl:text-[64px] font-bold text-center uppercase max-md:text-[42px]">
              Where <span style={styles.text_red}>Fitness </span>
            </h1>
            <h1 className="text-5xl md:text-6xl xl:text-[64px] font-bold mb-5 text-center pt-2 uppercase max-md:text-[42px]">
              Finds Its <span style={styles.text_red}>Form </span>
            </h1>
            <h1
              className="text-5xl md:text-6xl xl:text-[64px] font-bold mb-5 text-center uppercase max-md:text-[42px]"
              style={styles.negative_mt}
            >
              In Every <span style={styles.text_red}>Motion!</span>
            </h1>
            <p className="text-lg text-zinc-500 mb-5 text-center w-3/5 max-md:w-4/5">
              Fitformotion is an AI-powered fitness app for beginners, offering
              personalized workout plans, real-time tracking, and progress
              insights. Easily find exercises, customize your routine, and stay
              motivated as you achieve your fitness goals.
            </p>
            <div className="flex gap-3 mt-6 justify-center">
              <Button
                style={styles.button_bg_primary_800}
                className="text-white"
                as={Link}
                prefetch={false}
                href="/dashboard"
                size="lg"
              >
                <IconPlayerPlayFilled size={18} />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 px-3 mt-[-125px] md:px-10  max-w-screen-2xl mx-auto flex justify-center mx">
        <Image src={MockupFitformotion} alt="Fitformotion Mockup" />
      </section>

      <section className="mb-10 pb-[50px] px-3 pb-50 max-md:px-[30px] max-w-screen-2xl mx-auto flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7 w-4/5 max-md:w-full">
          {cardData.map((card, index) => (
            <Card
              key={index}
              className="text-zinc-800 dark:text-zinc-200 bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-xl p-5"
              shadow="none"
            >
              <CardHeader className="font-bold gap-3 text-2xl">
                <span
                  className="flex items-center justify-center bg-primary rounded-full h-8 w-8 shrink-0 text-white"
                  style={styles.button_bg_primary_800}
                >
                  <card.icon size={25} />
                </span>
                {card.title}
              </CardHeader>
              <CardBody className="text-sm pl-14 text-zinc-500">
                {card.body}
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* <section className="mb-10 py-[50px] px-3 pb-50 max-md:px-[30px]   max-w-screen-2xl mx-auto flex justify-center">
        <div className="flex flex-row max-md:flex-col gap-x-10 w-4/5 max-md:w-full">
          <div className="w-2/5 max-md:w-full">
            <Image
              src={partnersLogo}
              alt="3k Muscle Fitness Logo"
              className="rounded-lg"
            />
          </div>
          <div className="w-3/5 flex gap-y-5 flex-col justify-center max-md:w-full max-md:py-5">
            <p className="text-1xl uppercase font-bold" style={styles.text_red}>
              Beneficiary
            </p>
            <h2 className="text-5xl font-bold">3k Muscle Fitness</h2>
            <p className="text-zinc-500">
              For over a decade, 3K&apos;s Muscle Fitness Center has been a
              pillar in the fitness community, dedicated to helping individuals
              exceed their limits. Located at the 2nd floor of Victory Central
              Station Building in Olongapo City, Philippines, our center offers
              a diverse range of services including{" "}
              <span className="text-zinc-400 font-semibold">Kickboxing</span>,{" "}
              <span className="text-zinc-400 font-semibold">
                Personal Training
              </span>
              , <span className="text-zinc-400 font-semibold">Metapwr</span>,{" "}
              <span className=" text-zinc-400 font-semibold">Metafit</span>, and{" "}
              <span className="text-zinc-400 font-semibold">
                Shotokan Karate
              </span>
              . With experienced trainers and a commitment to holistic fitness,
              we strive to empower our members to achieve their health and
              wellness goals. Contact us at +63 919 230 5598 or +63 921 555 9069
              to embark on your fitness journey today.
            </p>
            <div className="flex gap-3 mt-6 max-md:flex-col">
              <Button
                style={styles.button_bg_primary_800}
                className="text-white"
                as={Link}
                prefetch={false}
                href="tel:+639215559069"
                size="lg"
              >
                <IconPhoneFilled size={18} />
                Call at +63 921 555 9069
              </Button>
              <Button
                style={styles.button_bg_primary_800}
                className="text-white"
                as={Link}
                prefetch={false}
                href="tel:+639192305598"
                size="lg"
              >
                <IconPhoneFilled size={18} />
                Call at +63 919 230 5598
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="mb-10 py-[50px] px-3 pb-50 max-md:px-[30px] max-w-screen-2xl mx-auto flex justify-center">
        <div className="flex flex-col items-center justify-center gap-[50px]">
          <div className="flex flex-col max-md:flex-col gap-y-[10px] w-4/5 max-md:w-full">
            <p
              className="text-1xl uppercase font-bold text-center"
              style={styles.text_red}
            >
              Our Team
            </p>
            <h2 className="text-5xl font-bold text-center">
              Meet Trifecta Proximity
            </h2>
          </div>
          <div className="flex flew-row w-4/5 gap-[40px] max-md:flex-col max-md:w-full">
            <div className="flex flex-col items-center w-2/6 max-md:w-full">
              <Image
                src={Hustler}
                alt="Trifecta Proximity Team Member 1"
                className="rounded-[25px]"
              />
              <h3 className="text-2xl font-bold mt-5">Mahasiah Bautista</h3>
              <p className="text-zinc-500 ">Hustler</p>
            </div>
            <div className="flex flex-col items-center w-2/6 max-md:w-full">
              <Image
                src={Hipster}
                alt="Trifecta Proximity Team Member 2"
                className="rounded-[25px]"
              />
              <h3 className="text-2xl font-bold mt-5">Christian Jay Cuya</h3>
              <p className="text-zinc-500 ">Hipster</p>
            </div>
            <div className="flex flex-col items-center w-2/6 max-md:w-full">
              <Image
                src={Hacker}
                alt="Trifecta Proximity Team Member 3"
                className="rounded-[25px]"
              />
              <h3 className="text-2xl font-bold mt-5">Andrea Anne Orca</h3>
              <p className="text-zinc-500 ">Hacker</p>
            </div>
          </div>
        </div>
      </section> */}

      <footer className="mb-5 py-3 px-3 md:px-10 bg-background">
        <div className="copyright">
          <p className="text-center text-stone-300">
            @ {currentYear} Trifecta Proximity. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
