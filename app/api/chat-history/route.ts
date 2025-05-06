import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  defaultHeaders: {
    'OpenAI-Beta': 'assistants=v2'
  }
});

export const runtime = "edge";

export async function GET(req: Request) {
  // Get the threadId from the URL query parameters
  const url = new URL(req.url);
  const threadId = url.searchParams.get("threadId");
  
  if (!threadId) {
    return new Response(
      JSON.stringify({ error: "No threadId provided" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  
  try {
    // Get all messages for this thread
    const messages = await openai.beta.threads.messages.list(threadId, { 
      order: "asc",
      limit: 100 // You might want to paginate for very long conversations
    });
    
    // Format the messages for your frontend
    const formattedMessages = messages.data.map(msg => {
      const content = msg.content
        .filter(item => item.type === "text")
        .map(item => item.type === "text" ? item.text.value : null)
        .filter(Boolean)
        .join(" ");
        
      return {
        role: msg.role,
        content: content
      };
    });
    
    return new Response(
      JSON.stringify({ messages: formattedMessages }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat history" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}