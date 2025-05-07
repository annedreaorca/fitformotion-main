"use client";
import introJs from "intro.js";
import "intro.js/minified/introjs.min.css";
import { useEffect } from "react";

// Function to start the tour (can be called from anywhere)
export const startTour = () => {
  const intro = introJs();
  intro.setOptions({
    steps: [
      {
        element: "#coaches-page",
        title: "Coaches Page",
        intro: "Welcome to our coaches page! Here's you can check out some of the fitness coaches that offer online coaching.",
      },
      {
        element: ".profile-item",
        title: "Coach Cards",
        intro: "These cards showcase our fitness coaches. Hover over or click any card to see more details about the coach.",
      }
    //   {
    //     element: ".profile-image",
    //     title: "Coach Photos",
    //     intro: "Each card shows a photo of the coach. When you hover, the image will become more vibrant.",
    //   },
    //   {
    //     element: ".profile-info",
    //     title: "Coach Information",
    //     intro: "Hover over a card to reveal the coach's name, specialization, and contact details.",
    //   },
    //   {
    //     element: ".profile-details",
    //     title: "Contact Options",
    //     intro: "Find various ways to connect with our coaches through social media, phone, or email.",
    //   }
    ],
    showProgress: true,
    showBullets: false,
  });
  intro.start();
};

// Optional: Start the tour automatically when the component mounts
export default function TourGuide({ autoStart = false }) {
  useEffect(() => {
    if (autoStart) {
      startTour();
    }
  }, [autoStart]);

  return null; // This component doesn't render anything
}