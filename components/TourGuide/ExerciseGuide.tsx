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
            element: "#exercises-heading",
            title: "Exercises Page",
            intro: "Welcome to the Exercises page! Here, you can explore different exercises and filter them according to your preferences.",
        },
        {
            element: "#filters-container",
            title: "Filters",
            intro: "Use these filters to narrow down exercises based on categories, muscle groups, difficulty levels, and more.",
        },
        {
            element: "#exercise-table",
            title: "Exercise List",
            intro: "This table displays all available exercises that match your selected filters.",
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
