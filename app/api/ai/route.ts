// Import necessary libraries
import { experimental_AssistantResponse } from "ai"; // AI helper for handling assistant responses
import OpenAI from "openai"; // OpenAI SDK

// Initialize OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Ensure the environment variable for API key is set
});

// Specify the runtime as "edge" for optimal performance
export const runtime = "edge";

// Main POST handler for chat requests
export async function POST(req: Request) {
  // Parse the incoming JSON request to extract the thread ID and user message
  const input: {
    threadId: string | null; // Existing thread ID or null
    message: string; // User's input message
  } = await req.json();

  // If no thread ID is provided, create a new thread
  const threadId =
    input.threadId ??
    (await openai.beta.threads.create({})).id; // Creates a new thread for conversation

  // Add the user's message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user", // Marks this as a user message
    content: input.message, // The message content from the user
  });

  // Return an experimental assistant response
  return experimental_AssistantResponse(
    { threadId, messageId: createdMessage.id }, // Metadata for the thread
    async ({ threadId, sendMessage }) => {
      // Start the assistant run using your assistant ID
      let run = await openai.beta.threads.runs.create(threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ?? // Replace with your Assistant ID environment variable
          (() => {
            throw new Error("ASSISTANT_ID is not set"); // Throws an error if ASSISTANT_ID is missing
          })(),
      });

      // Function to wait until the assistant's run is completed
      async function waitForRunCompletion(
        run: OpenAI.Beta.Threads.Runs.Run,
      ): Promise<OpenAI.Beta.Threads.Runs.Run> {
        // Polling the run status
        while (run.status === "queued" || run.status === "in_progress") {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Short delay
          run = await openai.beta.threads.runs.retrieve(threadId, run.id); // Update run status
        }
        return run;
      }

      run = await waitForRunCompletion(run);

      // Check if the run completed successfully
      if (run.status !== "completed") {
        throw new Error(`Run did not complete successfully: ${run.status}`);
      }

      // Retrieve and send the assistant's responses
      const responseMessages = (
        await openai.beta.threads.messages.list(threadId, { order: "asc" }) // Fetch messages in order
      ).data;

      for (const message of responseMessages) {
        if (message.role === "assistant") {
          // Only process assistant messages
          sendMessage({
            id: message.id, // Message ID for tracking
            role: "assistant", // Specifies this as an assistant message
            content: message.content.filter(
              (content) => content.type === "text", // Only include text content
            ),
          });
        }
      }
    },
  );
}
