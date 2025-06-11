"use server";

import { Xendit } from 'xendit-node';

// Initialize Xendit directly in this file
const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});
import { clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function createPaymentInvoice(
  userId: string, 
  coachId: string, 
  coachName: string,
  paymentMethod: 'GCASH' | 'PAYMAYA'
) {
  try {
    console.log('Creating payment invoice for:', { userId, coachId, coachName, paymentMethod });
    
    const user = await clerkClient.users.getUser(userId);
    console.log('User found:', user.firstName, user.lastName);
    
    const coach = await clerkClient.users.getUser(coachId);
    console.log('Coach found:', coach.firstName, coach.lastName);
    
    // Check if Xendit secret key is available
    if (!process.env.XENDIT_SECRET_KEY) {
      console.error('XENDIT_SECRET_KEY is not set');
      return { success: false, error: "Payment configuration error" };
    }
    
    console.log('Creating invoice with Xendit...');
    
    // Create payment invoice
    const invoice = await xendit.Invoice.createInvoice({
      externalId: `coach-selection-${userId}-${coachId}-${Date.now()}`,
      amount: 500, // Set your price here (e.g., 500 PHP)
      description: `Coach Selection - ${coachName}`,
      invoiceDuration: 86400, // 24 hours
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.emailAddresses[0]?.emailAddress,
      paymentMethods: [paymentMethod],
      successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/select-coach/payment-success?coachId=${coachId}&coachName=${encodeURIComponent(coachName)}`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/select-coach/payment-failed`,
      currency: 'PHP',
      items: [
        {
          name: `Coach Selection - ${coachName}`,
          quantity: 1,
          price: 500,
          category: 'Fitness Coaching'
        }
      ],
      customerNotificationPreference: {
        invoiceCreated: ['email'],
        invoicePaid: ['email']
      },
      metadata: {
        userId,
        coachId,
        coachName,
        paymentMethod
      }
    } as any);

    console.log('Invoice created successfully:', invoice.id);
    return { success: true, invoiceUrl: invoice.invoiceUrl };
  } catch (error) {
    console.error("Detailed error creating payment invoice:", error);
    
    // Log more specific error details
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    // Check if it's a Xendit API error
    if (error && typeof error === 'object' && 'response' in error) {
      console.error("Xendit API response:", (error as any).response?.data);
    }
    
    return { success: false, error: `Payment setup failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

