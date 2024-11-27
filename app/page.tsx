import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { IconChevronsDown, IconPlayerPlayFilled } from "@tabler/icons-react";

import "animate.css";
import Link from "next/link";

// import { Hacker, Hipster, Hustler } from ".";
import Footer from "./_components/Footer/Footer";
import Header from "./_components/Header/Header";

export default function Home() {
  const cardData = [
    {
      // icon: IconChartHistogram,
      title: "See Your Progress In Motion",
      body: "Stay connected to your fitness progress through specialized tracking and customizable visualization tools.",
    },
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
  ];

  return (
    <main>
      <Header />
      <section className="relative px-3 max-md:px-[30px] max-md:mt-[-30px] mx-auto flex justify-center hero-section max-[767px]:items-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
          autoPlay
          muted
          loop
          playsInline // Add this attribute
        >
          <source src="/videos/hero-video-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="flex items-center pt-[200px] pb-[150px] max-[767px]:pt-[100px] max-[767px]:pb-[100px] max-[767px]:flex-col gap-5 page-width  animate__animated animate__fadeInLeft max-[768]:animate__animated animate__fadeInUp duration-1000">
          <div className="flex flex-col justify-start text-left w-[50%] max-[1080px]:w-[60%]  max-[900px]:w-[80%] max-[767px]:w-[100%] max-[767px]:items-center max-[767px]:pt-[100px] max-[580px]:pt-[50px]">
            <div className="flex justify-start mb-5">
              <span className="section-label">FITFORMOTION</span>
            </div>
            <h1 className="hero-headline uppercase text-white leading-[60px] max-[767px]:text-center">
              Where <span className="red">Fitness</span>
              <br />
              Finds Its <span className="red">Form</span>
              <br />
              In Every <span className="red">Motion!</span>
            </h1>
            <p className="text-zinc-500 mt-6 mb-6 max-[767px]:text-center description">
              Easily find exercises, customize your routine, and stay motivated
              as you achieve your fitness goals.
            </p>
            <div className="flex gap-3 mt-6 justify-start">
              <a
                href="#get-started"
                className="p-[15px] rounded-full bg-[#00000000] text-[#ffffff26] border border-[#ffffff26] hover:border-[#ffffffCC] hover:text-[#ffffffCC] animate__animated animate__pulse animate__infinite animate__slow transition ease-in-out delay-150"
              >
                <IconChevronsDown className="w-[30px] h-[30px]" size={18} />
              </a>
            </div>
          </div>
          {/* <div className="w-[50%] max-[767px]:hidden"></div> */}
        </div>
      </section>

      <section
        className="py-[100px] mx-auto flex justify-center our-services"
        id="get-started"
      >
        <div className="flex gap-[50px] max-[580px]:flex-col items-center section-container page-width  animate__animated animate__fadeInUp duration-1000">
          <div className="flex flex-col gap-[20px] w-[40%] max-[580px]:w-[100%]">
            <div className="flex justify-start">
              <span className="section-label">Key Features</span>
            </div>
            <h2 className="section-headline">Unleash Your Potential</h2>
            <p className="text-zinc-500 description">
              Achieve your fitness goals with personalized workouts and
              real-time progress insights designed to help you grow stronger
              every day.
            </p>
            <div className="flex gap-3 mt-6 justify-start">
              <Button
                className="bg-primary-800 text-white"
                as={Link}
                prefetch={false}
                href="/features"
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
                <CardHeader className="gap-[10px]">
                  <h4 className="font-bold section-headline text-white">
                    {card.title}
                  </h4>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-zinc-500 description">
                    {card.body}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
