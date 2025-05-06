"use client";

import { useUser } from '@clerk/nextjs';
import { ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define our wizard steps
const WIZARD_STEPS = [
  {
    title: "Welcome to Our App!",
    description: "We're excited to have you on board. Let's set up your profile to get the most out of your experience.",
    icon: "👋"
  },
  {
    title: "Your Fitness Goals",
    description: "Tell us what you're looking to achieve so we can personalize your experience.",
    icon: "🎯"
  },
  {
    title: "Your Experience Level",
    description: "Let us know your fitness background to better tailor our recommendations.",
    icon: "💪"
  },
  {
    title: "Almost Done!",
    description: "Just a few more details to complete your profile setup.",
    icon: "✅"
  }
];

export default function IntroductionWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSeenWizard, setHasSeenWizard] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Check if profile is complete and if wizard has been shown before
    const checkProfileCompletion = async () => {
      if (!user) return;
      
      try {
        // Check if profile is complete and if wizard has been seen
        const response = await fetch(`/api/profile/check-completion`);
        const data = await response.json();
        
        // If wizard has been seen according to database, don't show it
        if (data?.hasSeenWizard) {
          setHasSeenWizard(true);
          return;
        }
        
        // Show wizard if profile is complete but user hasn't seen it yet
        if (data?.isComplete && !data?.hasSeenWizard) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error checking profile completion:", error);
      }
    };
    
    checkProfileCompletion();
  }, [user]);

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeWizard();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeWizard = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update database to mark wizard as seen
      const response = await fetch('/api/profile/update-wizard-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hasSeenWizard: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update wizard status');
      }
      
      setHasSeenWizard(true);
      setIsOpen(false);
      
      // Refresh the page to apply changes
      router.refresh();
    } catch (error) {
      console.error("Error completing wizard:", error);
    } finally {
      setLoading(false);
    }
  };

  const skipWizard = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update database to mark wizard as seen
      const response = await fetch('/api/profile/update-wizard-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hasSeenWizard: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update wizard status');
      }
      
      setHasSeenWizard(true);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error skipping wizard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || hasSeenWizard) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-800 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">{WIZARD_STEPS[currentStep].icon}</span>
            {WIZARD_STEPS[currentStep].title}
          </h2>
          <button 
            onClick={skipWizard} 
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-6">{WIZARD_STEPS[currentStep].description}</p>
          
          {/* Step content */}
          <div className="space-y-4">
            {currentStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg text-white font-medium">Welcome to our fitness app!</h3>
                <p className="text-gray-300">
                  We're thrilled to have you join our community. This brief introduction will guide you through what our app has to offer.
                </p>
                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900 bg-opacity-20 rounded">
                  <p className="text-gray-200">
                    Track your workouts, monitor your progress, and achieve your fitness goals with our comprehensive tools.
                  </p>
                </div>
              </div>
            )}
            
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg text-white font-medium">Personalized Fitness Journey</h3>
                <p className="text-gray-300">
                  Our app adapts to your unique fitness goals, whether you're looking to lose weight, build muscle, or improve overall health.
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="text-2xl mb-2">🏋️</div>
                    <div className="text-sm">Strength</div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="text-2xl mb-2">🏃</div>
                    <div className="text-sm">Cardio</div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="text-2xl mb-2">🧘</div>
                    <div className="text-sm">Flexibility</div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg text-white font-medium">For Every Experience Level</h3>
                <p className="text-gray-300">
                  Whether you're just starting out or are an experienced athlete, we have workouts and programs tailored to your level.
                </p>
                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                  <div className="text-center flex-1">
                    <div className="text-sm text-gray-400">Beginner</div>
                    <div className="mt-1 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-sm text-gray-400">Intermediate</div>
                    <div className="mt-1 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-sm text-gray-400">Advanced</div>
                    <div className="mt-1 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg text-white font-medium">Ready to start your journey?</h3>
                <p className="text-gray-300">
                  You can customize your profile settings anytime from your account dashboard. Let's get started!
                </p>
                <div className="bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-800">
                  <div className="flex items-center mb-2">
                    <div className="text-blue-400 mr-2">💡</div>
                    <div className="text-blue-300 font-medium">Pro Tip</div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Don't forget to check out the 'Programs' section for curated workout plans designed to help you reach your goals faster.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-800 p-4 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg ${
              currentStep === 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 disabled:opacity-70"
          >
            {currentStep < WIZARD_STEPS.length - 1 ? 'Next' : 'Get Started'}
            {!loading && <ArrowRight size={16} />}
            {loading && <span className="animate-spin">⏳</span>}
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex gap-1 justify-center pb-4">
          {WIZARD_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full ${
                index <= currentStep ? 'bg-blue-500 w-8' : 'bg-gray-700 w-6'
              } transition-all duration-300`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}