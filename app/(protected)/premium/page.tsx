'use client';
import PageHeading from "@/components/PageHeading/PageHeading";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PremiumPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Call the payment-intent API to create a new Payment Intent
      const paymentIntentResponse = await fetch('/api/paymongo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 10000, description: 'Fitformotion Premium' }), // Amount in PHP cents
      });

      if (!paymentIntentResponse.ok) {
        const errorData = await paymentIntentResponse.json();
        setErrorMessage(`Error: ${errorData.error || 'Failed to create Payment Intent'}`);
        setLoading(false);
        return;
      }

      const paymentIntent = await paymentIntentResponse.json();

      // Display the payment link (checkout URL) for the user to complete the payment
      const checkoutUrl = paymentIntent.data.attributes.checkout_url;

      // Open the payment link in a new tab
      window.open(checkoutUrl, '_blank');

    } catch (error) {
      setErrorMessage(`Error creating payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeading title="Upgrade to Premium" />
      <p className="mb-[20px]">At Fitformotion, we believe in making fitness accessible to everyone. Our freemium model allows you to choose a plan that best suits your fitness journey. Whether you&apos;re just starting or are ready to take your training to the next level, we have you covered! </p>
      <div className="flex gap-[40px] max-[768px]:flex-col">
        <div className="bg-zinc-200 dark:bg-[#070707] p-[35px] w-[50%] rounded-[15px] border-1 border-zinc-400 dark:border-zinc-900 max-[768px]:w-[100%]">
          <p className="font-[500] text-[16px] uppercase plan-type">Base Plan</p>
          <div className="flex items-end gap-[10px] mt-[20px]">
              <span className="font-[500] text-[64px] max-[580px]:text-[55px] leading-[60px] text-[#070707] dark:text-white">Free</span>
          </div>
          <div className="flex gap-3 mt-[30px] justify-start">
              <span className="bg-[#b9b9b9] dark:bg-zinc-900 text-[#797979] dark:text-[#696969] w-[100%] py-[20px] px-[35px] rounded-[10px] text-center">
                  Current Plan
              </span>
          </div>
          <div className="separator">
              <hr className="border-[#c0c0c0] dark:border-[#1a1a1a] mt-[40px] mb-[40px]"/>
          </div>
          <div className="flex flex-col gap-[17px] pricing-includes">
            <div className="">
              <p className="font-[500] text-[16px] text-[#070707] dark:text-white">Features</p>
            </div>
            <ul className="flex flex-col gap-[12px] text-sm">
                <li className="flex gap-3 items-center text-zinc-500">
                  <div><IconCircleCheckFilled width={20}  /></div>
                  <span>Access to a <span className="text-[#141414] dark:text-zinc-300 font-[500]">limited exercise library</span></span>
                </li>
                <li className="flex gap-3 items-center text-zinc-500">
                  <div><IconCircleCheckFilled width={20}  /></div>
                  <span>Suggested routines to kickstart your fitness journey</span>
                </li>
                <li className="flex gap-3 items-center text-zinc-500">
                  <div><IconCircleCheckFilled width={20}  /></div>
                  <span>Basic workout tracking to monitor your progress</span>
                </li>
                <li className="flex gap-3 items-center text-zinc-500">
                  <div><IconCircleCheckFilled width={20}  /></div>
                  <span>Community support for motivation and guidance</span>
                </li>
            </ul>
          </div>
        </div>
        <div className="bg-zinc-200 dark:bg-[#070707] p-[35px] w-[50%] rounded-[15px] border-1 border-primary-800 max-[768px]:w-[100%]">
          <p className="font-[500] text-[16px] uppercase plan-type">Premium Plan</p>
          <div className="flex items-end gap-[10px] mt-[20px]">
            <span className="font-[500] text-[64px] max-[580px]:text-[55px] leading-[60px] text-[#070707] dark:text-white">₱99</span>
            <span className="text-[#070707] dark:text-white">/ month</span>
          </div>
          <div className="flex gap-3 mt-[30px]">
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button onClick={handlePayment} disabled={loading} className="bg-primary-800 text-[#ffffff] w-[100%] py-[20px] px-[35px] rounded-[10px] text-center transition-all duration-300 hover:opacity-80">
              {loading ? 'Processing...' : 'Upgrade to Premium'}
            </button>
          </div>
          <div className="separator">
              <hr className="border-[#c0c0c0] dark:border-[#1a1a1a] mt-[40px] mb-[40px]"/>
          </div>
          <div className="flex flex-col gap-[17px] pricing-includes">
            <div className="">
                <p className="font-[500] text-[16px] text-[#070707] dark:text-white">Features</p>
            </div>
            <ul className="flex flex-col gap-[12px] text-sm">
                <li className="flex gap-3 items-center text-primary-800">
                    <div><IconCircleCheckFilled width={20}  /></div>
                    <span className="text-zinc-500"><span className="text-[#141414] dark:text-zinc-300 font-[500]">Unlock over 800 exercises,</span> including detailed guides and tips</span>
                </li>
                <li className="flex gap-3 items-center text-primary-800">
                    <div><IconCircleCheckFilled width={20}  /></div>
                    <span className="text-zinc-500"><span className="text-[#141414] dark:text-zinc-300 font-[500]">Tailored workout routines</span> designed to fit your specific goals and fitness level</span>
                </li>
                <li className="flex gap-3 items-center text-primary-800">
                    <div><IconCircleCheckFilled width={20}  /></div>
                    <span className="text-zinc-500">Access to the<span className="text-[#141414] dark:text-zinc-300 font-[500]"> AI-powered fitness chatbot</span> for personalized workout
                    recommendations and support</span>
                </li>
                <li className="flex gap-3 items-center text-primary-800">
                    <div><IconCircleCheckFilled width={20}  /></div>
                    <span className="text-zinc-500">Advanced progress tracking and analytics with insights into your performance</span>
                </li>
                <li className="flex gap-3 items-center text-primary-800">
                    <div><IconCircleCheckFilled width={20}  /></div>
                    <span className="text-zinc-500">Exclusive content and resources to enhance your fitness journey</span>
                </li>
                <li className="flex gap-3 items-center text-primary-800">
                    <div><IconCircleCheckFilled width={20}  /></div>
                    <span className="text-zinc-500">Priority support from our team of fitness experts</span>
                </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
