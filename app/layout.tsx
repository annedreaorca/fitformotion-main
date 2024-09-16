import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import Header from "./_components/Header/Header";
import Footer from "./_components/Footer/Footer";

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    //themeColor: "#18181b",
  };
}

const alexandria = Alexandria({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitformotion: Log, Analyze, and Optimize Your Workouts",
  description:
    "Take Control of Your Fitness Goals with Fitformotion. The intuitive workout tracking web app designed to optimize your gym sessions and improve your results.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="min-h-dvh flex flex-col"
      suppressHydrationWarning
    >
      <body
        className={`${alexandria.className} flex flex-col grow overflow-x-hidden`}
      >
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                border: "none",
                color: "white",
              },
            }}
          />
          <Header/>
          {children}
          <Footer/>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
