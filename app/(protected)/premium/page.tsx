'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div>
      <h1>Upgrade to Premium</h1>
      <p>Get access to premium features for PHP 100/month!</p>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Get Premium'}
      </button>
    </div>
  );
};

export default PremiumPage;
