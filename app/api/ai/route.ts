import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  defaultHeaders: {
    'OpenAI-Beta': 'assistants=v2'
  }
});

export const runtime = "edge";

export async function POST(req: Request) {
  const input: { message: string; threadId?: string } = await req.json();
  
  // Create a new thread if threadId is not provided or use the existing one
  let threadId: string;
  if (!input.threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
  } else {
    // We know input.threadId is not undefined here
    threadId = input.threadId;
  }
  
  // Add the user message to the thread
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });

  // Start the assistant run
  let run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: process.env.ASSISTANT_ID ?? (() => {
      throw new Error("ASSISTANT_ID is not set");
    })(),
  });

  async function waitForRunCompletion(runId: string, threadId: string) {
    let currentRun = await openai.beta.threads.runs.retrieve(threadId, runId);
    while (currentRun.status === "queued" || currentRun.status === "in_progress") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      currentRun = await openai.beta.threads.runs.retrieve(threadId, runId);
    }
    return currentRun;
  }

  run = await waitForRunCompletion(run.id, threadId);

  if (run.status !== "completed") {
    throw new Error(`Run did not complete successfully: ${run.status}`);
  }

  // Get only the latest message (the assistant's response to this request)
  const messages = await openai.beta.threads.messages.list(threadId, { 
    order: "desc",
    limit: 1
  });
  
  const assistantMessage = messages.data[0];
  
  // Extract the content from the assistant message
  const messageContent = assistantMessage.content
    .filter((content) => content.type === "text")
    .map((content) => content.type === "text" ? content.text.value : null)
    .filter(Boolean)
    .join(" ");

  return new Response(
    JSON.stringify({ 
      content: messageContent,
      threadId: threadId // Return the threadId so it can be stored in localStorage
    }), 
    { headers: { "Content-Type": "application/json" } }
  );
}