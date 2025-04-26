import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  defaultHeaders: {
    'OpenAI-Beta': 'assistants=v2'
  }
});

export const runtime = "edge";

export async function POST(req: Request) {
  const input: { message: string } = await req.json();

  const thread = await openai.beta.threads.create();
  const userMessage = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: input.message,
  });

  // Start the assistant run
  let run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: process.env.ASSISTANT_ID ?? (() => {
      throw new Error("ASSISTANT_ID is not set");
    })(),
  });

  async function waitForRunCompletion(run: OpenAI.Beta.Threads.Runs.Run) {
    while (run.status === "queued" || run.status === "in_progress") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    return run;
  }

  run = await waitForRunCompletion(run);

  if (run.status !== "completed") {
    throw new Error(`Run did not complete successfully: ${run.status}`);
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

  return new Response(JSON.stringify({ content: assistantMessage }), {
    headers: { "Content-Type": "application/json" },
  });
}