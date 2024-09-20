import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  IconPlayerPlayFilled
} from "@tabler/icons-react";

import Link from "next/link";

import Footer from "./_components/Footer/Footer";
import Header from "./_components/Header/Header";

export default function Home() {
  const cardData = [
    {
      // icon: IconBarbell,
      title: "Find Your Ideal Workout",
      body: "Explore a wide library of workouts complete with instructions, videos, and useful tips on how to perform all kinds of exercises.",
      className: "",
    },
    {
      // icon: IconUserScan,
      title: "Personalized Fitness Programs",
      body: "Choose from our extensive collection of exercises to make personalized plans for your goals, timetable, and ability.",
    },
    {
      // icon: IconClipboardData,
      title: "Record & Track Your Workouts",
      body: "Stay motivated and keep your pace by tracking workouts in real time.",
    },
    {
      // icon: IconChartHistogram,
      title: "See Your Progress In Motion",
      body: "Stay connected to your fitness progress through specialized tracking and customizable visualization tools.",
    },
  ];

  return (
    <main>
      <Header/>
      <section className="relative py-10 px-3 h-screen max-md:px-[30px] max-md:mt-[-30px] mx-auto flex justify-center hero-section max-[767px]:items-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
          autoPlay
          muted
          loop
        >
          <source src="/videos/video-hero-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="flex items-center max-[767px]:flex-col gap-5 py-20 page-width">
          <div className="flex flex-col justify-start text-left w-[50%] max-[1080px]:w-[60%]  max-[900px]:w-[80%] max-[767px]:w-[100%] max-[767px]:items-center max-[767px]:pt-[100px] max-[580px]:pt-[50px]">
            <h1 className="hero-headline uppercase text-white leading-[60px] max-[767px]:text-center">
              Where <span className="red">Fitness</span><br />
              Finds Its <span className="red">Form</span><br />
              In Every <span className="red">Motion!</span>
            </h1>
            <p className="text-zinc-500 mt-5 mb-5 max-[767px]:text-center description">
              Easily find exercises, customize your routine, and stay motivated as you achieve your fitness goals.
            </p>
            <div className="flex gap-3 mt-6 justify-start">
              <Button
                className="bg-primary-800 text-white"
                as={Link}
                prefetch={false}
                href="/dashboard"
                size="md"
              >
                <IconPlayerPlayFilled size={18} />
                Get Started
              </Button>
            </div>
          </div>
          {/* <div className="w-[50%] max-[767px]:hidden"></div> */}
        </div>
      </section>

      <section className="py-[100px] mx-auto flex justify-center our-services">
        <div className="flex gap-[50px] max-[580px]:flex-col items-center section-container page-width">
          <div className="flex flex-col gap-[20px] w-[40%] max-[580px]:w-[100%]">
            <div className="flex justify-start">
              <span className="section-label">Key Features</span>
            </div>
            <h2 className="section-headline">Unleash Your Potential</h2>
            <p className="text-zinc-500 description">Achieve your fitness goals with personalized workouts and real-time progress insights designed to help you grow stronger every day.</p>
            <div className="flex gap-3 mt-6 justify-start">
              <Button
                className="bg-primary-800 text-white"
                as={Link}
                prefetch={false}
                href="/dashboard"
                size="md"
              >
                <IconPlayerPlayFilled size={18} />
                Learn More
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[15px] w-[60%] max-[580px]:w-[100%]">
            {cardData.map((card, index) => (
              <Card
                key={index}
                className="text-zinc-800 dark:text-zinc-200 bg-zinc-900 dark:bg-zinc-900/50 backdrop-blur-md shadow-xl p-5"
                shadow="none"
              >
                <CardHeader  className="gap-[10px]">
                  <h4 className="font-bold section-headline text-white">{card.title}</h4>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-zinc-500 description">{card.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
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
      <Footer/>
    </main>
  );
}
