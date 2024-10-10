"use client"; // This makes this component a Client Component

import { Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

const LegalNoticeModal = () => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null); // State to manage modal visibility
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Check if the user has already agreed
    const hasAgreed = localStorage.getItem('hasAgreed');
    if (hasAgreed) {
      setIsVisible(false); // Hide modal if already agreed
    } else {
      setIsVisible(true); // Show modal if not agreed
    }
    setIsLoading(false); // Set loading to false after checking
  }, []);

  // Function to handle the Agree button click
  const handleAgreeClick = () => {
    localStorage.setItem('hasAgreed', 'true'); // Set the flag in localStorage
    setIsVisible(false); // Hide the legal div
  };

  // Don't render the modal if it's still loading
  if (isLoading) return null;
  
  // Don't render the modal if it's not visible
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-[#000000] bg-opacity-85 overflow-y-auto h-full w-full flex items-center justify-center z-[999999] legaldiv"> 
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Modal Title</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">Modal Body</p>
          </div>
          <div className="flex justify-center mt-4">
            {/* Navigates back to the base URL - closing the modal */}
            <Link
              href="/"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Decline
            </Link>

            <Link
              href="#"
              id="agree"
              onClick={handleAgreeClick} // Attach click handler
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Agree
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalNoticeModal;
