import { Button } from "@nextui-org/button";
import "animate.css";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="relative px-3 max-md:px-[30px] max-md:mt-[-30px] mx-auto flex justify-center hero-section max-[767px]:items-center h-screen">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/hero-video-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="flex items-center justify-center pt-[150px] pb-[150px] max-[767px]:pt-[100px] max-[767px]:pb-[100px] max-[767px]:flex-col gap-5 page-width animate__animated animate__fadeInLeft max-[768]:animate__animated animate__fadeInUp duration-1000">
          <div className="flex flex-col justify-center text-left max-[767px]:items-center max-[767px]:pt-[100px] max-[580px]:pt-[50px]">
            <div className="flex justify-center mb-5">
              <span className="section-label">FITFORMOTION</span>
            </div>
            <h1 className="hero-headline uppercase text-white leading-[60px] text-center">
              Where <span className="red">Fitness</span>
              <br />
              Finds Its <span className="red">Form</span>
              <br />
              In Every <span className="red">Motion!</span>
            </h1>
            <p className="text-zinc-500 mt-6 mb-6 text-center description">
              Easily find exercises, customize your routine, and stay motivated
              as you achieve your fitness goals.
            </p>
            <div className="flex gap-4 justify-center max-[768px]:flex-col-reverse max-[768px]:items-center max-[768]:gap-1 mt-6">
              <Button
                className="bg-transparent text-white w-[150px] max-[768px]:w-[250px] border-1 border-white"
                as={Link}
                href="/dashboard"
                size="lg"
              >
                View Demo
              </Button>
              <Button
                className="bg-primary-800 text-white w-[150px] max-[768px]:w-[250px] border-1 border-primary-800"
                as={Link}
                href="/dashboard"
                size="lg"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
