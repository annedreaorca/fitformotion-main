import Image from "next/image";
import { GetInTouch } from "./GetInTouch";
import { PoweredBy } from "./PoweredBy";
import { QuickLinks } from "./QuickLinks";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-[12px] z-40 bg-[#070707] border-t-1 border-[#0c0c0c] footer-section">
      <div className=" page-width flex flex-col gap-[10px]">
        <div className="footer-top pt-[45px]">
          <div className="flex flex-col items-center gap-[20px]">
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
            <p className="text-[#747474] text-center">AI Fitness Progressive Web App (PWA) for Gym Beginners with Real-Time Progress Insights</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-[50px] footer-body py-[50px]">
          <div className="flex">
            <QuickLinks />
          </div>
          <div className="flex">
            <GetInTouch />
          </div>
          <div className="flex">
            <PoweredBy />
          </div>
        </div>
        <div className="footer-bottom border-t-1 border-[#222222]">
          <p className="text-center text-stone-300 pt-[20px] pb-[10px]">
            © {currentYear} Trifecta Proximity. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}