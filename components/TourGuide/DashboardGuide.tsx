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
            element: "#dashboard-heading",
            title: "Dashboard",
            intro: "Welcome to your dashboard! Here's a quick tour.",
        },
        {
            element: "#dashboard-cards",
            title: "Metrics",
            intro: "These are your key metrics and stats.",
        },
        {
            element: "#dashboard-charts",
            title: "Charts",
            intro: "Track your progress with these charts.",
        },
        {
            element: "#dashboard-links",
            title: "Quick Links",
            intro: "Quick links to other important sections.",
        },
        {
            element: "#dashboard-goals",
            title: "Goals",
            intro: "Set and review your fitness goals here.",
        },
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
