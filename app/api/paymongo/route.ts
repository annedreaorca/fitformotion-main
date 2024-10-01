// fitformotion/app/api/paymongo/payment-intent.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req); // Retrieve user ID from Clerk

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, description } = await req.json(); // Parse the request body

    // Prepare the payload for creating a payment link
    const payload = {
      data: {
        attributes: {
          amount,
          description,
        },
      },
    };

    // Make a POST request to the Paymongo API to create a payment link
    const paymentLinkResponse = await fetch('https://api.paymongo.com/v1/links', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'authorization': `Basic ${Buffer.from('sk_test_22YtSJdfnCWc79ZTQKKYmQqP').toString('base64')}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!paymentLinkResponse.ok) {
      const errorData = await paymentLinkResponse.json();
      return NextResponse.json({ error: errorData }, { status: 500 });
    }

    const paymentLink = await paymentLinkResponse.json();

    return NextResponse.json(paymentLink, { status: 200 });
  } catch (error) {
    console.error("Error creating payment link:", error);
    return NextResponse.json({ error: "Error creating payment link" }, { status: 500 });
  }
}
