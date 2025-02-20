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
                element: "#profile-hero",
                title: "Profile Overview",
                intro: "This is your profile header. It displays your username and profile image.",
            },
            {
                element: "#profile-stats",
                title: "Your Stats",
                intro: "Here, you can view your age, height, and weight. If you haven't set them up yet, make sure to input your details for accurate tracking!",
            },
            {
                element: "#theme-switcher",
                title: "Theme Switcher",
                intro: "Toggle between light and dark mode to suit your preference.",
            },
            {
                element: "#profile-details",
                title: "Profile Details",
                intro: "This section contains your basic account details such as name and username.",
            },
            {
                element: "#profile-measurements",
                title: "Body Measurements",
                intro: "Track your physical stats like weight and height here.",
            },
            {
                element: "#profile-equipment",
                title: "Your Equipment",
                intro: "See and manage the equipment you own for workouts.",
            },
            {
                element: "#profile-actions",
                title: "Sign Out",
                intro: "Click here to sign out of your account.",
            }
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
