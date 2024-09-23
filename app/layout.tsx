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
    maximumScale: 1, // Prevent zooming
    userScalable: "no", // Disable user scaling
  };
}

const alexandria = Alexandria({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitformotion: Every Rep Smarter, Every Goal Closer",
  description:
    "Fitformotion provides gym beginners with personalized workout plans, real-time tracking, and smart progress insights ensuring every rep leads to faster, smarter gains.",
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
          {children}
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}