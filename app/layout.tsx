import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

// Viewport settings with zooming disabled
export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: "no",
  };
}

const alexandria = Alexandria({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Fitformotion: Every Rep Smarter, Every Goal Closer",
  description:
    "Fitformotion provides gym beginners with personalized workout plans, real-time tracking, and smart progress insights ensuring every rep leads to faster, smarter gains.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []); // Runs once when the app loads

  return (
    <html
      lang="en"
      className="min-h-dvh flex flex-col"
      suppressHydrationWarning
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
        <link rel="canonical" href="https://fitformotion.com/" />
      </head>
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
          {children}
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
