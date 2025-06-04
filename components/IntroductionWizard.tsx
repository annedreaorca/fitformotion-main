"use client";
import { useUser } from '@clerk/nextjs';
import { ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define our wizard steps
const WIZARD_STEPS = [
  {
    title: "Welcome to Fitformotion!",
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
      
      // Redirect to dashboard after completing the wizard
      router.push('/dashboard');
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
      
      // Redirect to dashboard after skipping the wizard
      router.push('/dashboard');
    } catch (error) {
      console.error("Error skipping wizard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || hasSeenWizard) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn">
      <div className="bg-black rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden border border-gray-800 animate-scaleIn">
        {/* Header */}
        <div className="border-b border-gray-800 p-5 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-3">
            <span className="text-2xl">{WIZARD_STEPS[currentStep].icon}</span>
            <span style={{ fontFamily: 'Alexandria, sans-serif' }}>
              {WIZARD_STEPS[currentStep].title}
            </span>
          </h2>
          <button 
            onClick={skipWizard} 
            className="text-gray-400 hover:text-white transition-colors duration-300 p-1 rounded-full hover:bg-gray-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="description" style={{ 
            fontSize: '15px', 
            fontWeight: '300', 
            lineHeight: '26px', 
            color: '#818181',
            fontFamily: 'Alexandria, sans-serif',
            marginBottom: '24px'
          }}>
            {WIZARD_STEPS[currentStep].description}
          </p>
          
          {/* Step content */}
          <div className="space-y-4">
            {currentStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg text-white font-medium" style={{ fontFamily: 'Alexandria, sans-serif' }}>
                  Welcome to Fitformotion!
                </h3>
                <p className="description" style={{ 
                  fontSize: '15px', 
                  fontWeight: '300', 
                  lineHeight: '26px', 
                  color: '#818181',
                  fontFamily: 'Alexandria, sans-serif'
                }}>
                  We&apos;re thrilled to have you join our community. This brief introduction will guide you through what our app has to offer.
                </p>
                <div className="border-l-4 border-red-800 pl-4 py-3 bg-red-900 bg-opacity-10 rounded" style={{ borderLeftColor: '#991b1b' }}>
                  <p className="text-gray-200" style={{ 
                    fontSize: '15px', 
                    fontWeight: '300', 
                    lineHeight: '26px',
                    fontFamily: 'Alexandria, sans-serif'
                  }}>
                    Track your workouts, monitor your progress, and achieve your fitness goals with our comprehensive tools.
                  </p>
                </div>
              </div>
            )}
            
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg text-white font-medium" style={{ fontFamily: 'Alexandria, sans-serif' }}>
                  Personalized Fitness Journey
                </h3>
                <p className="description" style={{ 
                  fontSize: '15px', 
                  fontWeight: '300', 
                  lineHeight: '26px', 
                  color: '#818181',
                  fontFamily: 'Alexandria, sans-serif'
                }}>
                  Our app adapts to your unique fitness goals, whether you&apos;re looking to lose weight, build muscle, or improve overall health.
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 transition-all duration-300 hover:border-red-800">
                    <div className="text-2xl mb-2">💪</div>
                    <div className="text-sm text-gray-300" style={{ fontFamily: 'Alexandria, sans-serif' }}>Strength</div>
                  </div>
                  <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 transition-all duration-300 hover:border-red-800">
                    <div className="text-2xl mb-2">🏋️</div>
                    <div className="text-sm text-gray-300" style={{ fontFamily: 'Alexandria, sans-serif' }}>Powerlifting</div>
                  </div>
                  <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 transition-all duration-300 hover:border-red-800">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-sm text-gray-300" style={{ fontFamily: 'Alexandria, sans-serif' }}>Olympic Weightlifting</div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg text-white font-medium" style={{ fontFamily: 'Alexandria, sans-serif' }}>
                  For Every Experience Level
                </h3>
                <p className="description" style={{ 
                  fontSize: '15px', 
                  fontWeight: '300', 
                  lineHeight: '26px', 
                  color: '#818181',
                  fontFamily: 'Alexandria, sans-serif'
                }}>
                  Whether you&apos;re just starting out or are an experienced athlete, we have workouts and programs tailored to your level.
                </p>
                <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <div className="text-center flex-1">
                    <div className="text-sm text-gray-400" style={{ fontFamily: 'Alexandria, sans-serif' }}>Beginner</div>
                    <div className="mt-2 h-1 bg-red-800 rounded-full" style={{ backgroundColor: '#991b1b' }}></div>
                  </div>
                  <div className="text-center flex-1 mx-2">
                    <div className="text-sm text-gray-400" style={{ fontFamily: 'Alexandria, sans-serif' }}>Intermediate</div>
                    <div className="mt-2 h-1 bg-red-800 rounded-full" style={{ backgroundColor: '#991b1b' }}></div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-sm text-gray-400" style={{ fontFamily: 'Alexandria, sans-serif' }}>Advanced</div>
                    <div className="mt-2 h-1 bg-red-800 rounded-full" style={{ backgroundColor: '#991b1b' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg text-white font-medium" style={{ fontFamily: 'Alexandria, sans-serif' }}>
                  Ready to start your journey?
                </h3>
                <p className="description" style={{ 
                  fontSize: '15px', 
                  fontWeight: '300', 
                  lineHeight: '26px', 
                  color: '#818181',
                  fontFamily: 'Alexandria, sans-serif'
                }}>
                  You can customize your profile settings anytime from your account dashboard. Let&apos;s get started!
                </p>
                <div className="bg-red-900 bg-opacity-10 p-4 rounded-lg border border-red-800" style={{ borderColor: '#991b1b' }}>
                  <div className="flex items-center mb-2">
                    <div className="text-red-400 mr-2">💡</div>
                    <div className="text-red-300 font-medium" style={{ 
                      fontFamily: 'Alexandria, sans-serif',
                      color: '#991b1b'
                    }}>Pro Tip</div>
                  </div>
                  <p className="text-gray-300 text-sm" style={{ 
                    fontSize: '14px', 
                    fontWeight: '300', 
                    lineHeight: '22px',
                    fontFamily: 'Alexandria, sans-serif'
                  }}>
                    Don&apos;t forget to check out the &apos;Suggested Routines&apos; section for curated workout plans designed to help you reach your goals faster.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-800 p-5 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-full font-normal transition-all duration-300 ${
              currentStep === 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-800'
                : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-gray-600'
            }`}
            style={{ fontFamily: 'Alexandria, sans-serif' }}
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={loading}
            className="px-6 py-2 text-white rounded-full flex items-center gap-2 disabled:opacity-70 transition-all duration-300 hover:opacity-90"
            style={{ 
              backgroundColor: '#991b1b',
              fontFamily: 'Alexandria, sans-serif'
            }}
          >
            {currentStep < WIZARD_STEPS.length - 1 ? 'Next' : 'Get Started'}
            {!loading && <ArrowRight size={16} />}
            {loading && <span className="animate-spin">⏳</span>}
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex gap-2 justify-center pb-5">
          {WIZARD_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index <= currentStep 
                  ? 'w-8' 
                  : 'bg-gray-700 w-6'
              }`}
              style={{ 
                backgroundColor: index <= currentStep ? '#991b1b' : '#374151'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}