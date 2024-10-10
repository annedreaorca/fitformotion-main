import Image from "next/image";
import { GetInTouch } from "./GetInTouch";
import { PoweredBy } from "./PoweredBy";
import { QuickLinks } from "./QuickLinks";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="z-40 bg-[#070707] border-t-1 border-[#0c0c0c] footer-section">
      <div className="flex gap-[20px] max-[910px]:flex-col max-[640px]:justify-center footer-body pt-[70px] pb-[80px] page-width">
        <div className="flex flex-col items-start justify-between gap-[25px] pr-[100px] w-[40%] max-[910px]:w-[100%] max-[910px]:pr-[0px] max-[910px]:pb-[50px] max-[640px]:items-center">
          <div className="flex flex-col items-start max-[640px]:items-center gap-[20px]">
            <a href="/" className="flex items-center gap-[20px]">
              <Image
                src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
                alt="Fitformotion Logo"
                className="w-[50px] h-[50px]"
                width={50}
                height={50}
              />
              <span className="text-white text-[26px] font-bold uppercase">Fitformotion</span>
            </a>
            <p className="text-[#747474] max-[640px]:text-center">AI Fitness Progressive Web App (PWA) for Gym Beginners with Real-Time Progress Insights</p>
          </div>
          <div className="max-[1024px]:hidden">
            <PoweredBy />
          </div>
        </div>
        <div className="flex gap-[20px] w-[60%] max-[910px]:w-[100%] max-[640px]:flex-col max-[640px]:gap-[50px]">
          <div className="flex w-[50%] max-[640px]:w-[100%]  max-[640px]:justify-center">
            <QuickLinks />
          </div>
          <div className="flex flex-col gap-[40px] w-[50%] max-[640px]:w-[100%] max-[640px]:gap-[50px]">
            <div className="">
              <GetInTouch />
            </div>
            <div className="hidden max-[1024px]:block">
              <PoweredBy />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom border-t-1 border-[#222222] page-width">
        <p className="text-center text-[14px] text-stone-300 py-[20px]">
          © {currentYear} Trifecta Proximity. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}