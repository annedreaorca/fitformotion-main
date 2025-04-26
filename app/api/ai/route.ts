import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  defaultHeaders: {
    'OpenAI-Beta': 'assistants=v2'
  }
});

export const runtime = "edge";

// Allowed origins - you can customize this as needed
const allowedOrigins = [
  'http://localhost:3000',
  'https://app.fitformotion.com', // Replace with your production domain
  // Add other allowed origins as needed
];

// Helper function to handle CORS
function setCorsHeaders(req: Request) {
  const origin = req.headers.get('origin');
  const responseHeaders = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  });

  // If the origin is in our allowed list, set the CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    responseHeaders.set('Access-Control-Allow-Origin', origin);
  } else {
    // For development, you can allow all origins with '*'
    // But for production, it's better to restrict to specific domains
    responseHeaders.set('Access-Control-Allow-Origin', '*');
  }

  return responseHeaders;
}

// Move the helper function outside the POST handler
async function waitForRunCompletion(run: OpenAI.Beta.Threads.Runs.Run, threadId: string) {
  let currentRun = run;
  while (currentRun.status === "queued" || currentRun.status === "in_progress") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    currentRun = await openai.beta.threads.runs.retrieve(threadId, currentRun.id);
  }
  return currentRun;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: Request) {
  const headers = setCorsHeaders(req);
  return new Response(null, {
    status: 204,
    headers
  });
}

export async function POST(req: Request) {
  const headers = setCorsHeaders(req);

  try {
    const input: { message: string } = await req.json();

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: input.message,
    });

    // Start the assistant run
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID ?? (() => {
        throw new Error("ASSISTANT_ID is not set");
      })(),
    });

    // Use the function that's now defined outside the block
    run = await waitForRunCompletion(run, thread.id);

    if (run.status !== "completed") {
      return new Response(
        JSON.stringify({ error: `Run did not complete successfully: ${run.status}` }), 
        { status: 500, headers }
      );
    }

    const responseMessages = (
      await openai.beta.threads.messages.list(thread.id, { order: "asc" })
    ).data;

    // Extract only the assistant's message content
    const assistantMessage = responseMessages
      .filter((msg) => msg.role === "assistant")
      .map((msg) =>
        msg.content
          .filter((content) => content.type === "text")
          .map((content) =>
            content.type === "text" ? content.text.value : null
          )
          .filter(Boolean)
          .join(" ")
      )
      .join("\n");

    return new Response(JSON.stringify({ content: assistantMessage }), { headers });
    
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }), 
      { status: 500, headers }
    );
  }
}