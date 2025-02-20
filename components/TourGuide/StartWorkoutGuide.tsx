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
                element: "#workout-heading",
                title: "Start Workout",
                intro: "This is where you can begin a new workout session.",
            },
            {
                element: "#new-routine-button",
                title: "Create a Routine",
                intro: "Click here to create a personalized workout routine.",
            },
            {
                element: "#user-routines-section",
                title: "Your Routines",
                intro: "This section contains your saved workout routines.",
            },
            {
                element: "#suggested-routines-section",
                title: "Suggested Routines",
                intro: "These are recommended workout routines based on your goals.",
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
