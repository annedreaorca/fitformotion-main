//app\api\chat-history\route.ts
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  defaultHeaders: {
    'OpenAI-Beta': 'assistants=v2'
  }
});

export const runtime = "nodejs"; // Changed from "edge" to match AI route

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the threadId from the URL query parameters
    const url = new URL(req.url);
    const threadId = url.searchParams.get("threadId");
    
    if (!threadId) {
      return NextResponse.json(
        { error: "No threadId provided" },
        { status: 400 }
      );
    }
    
    // Get all messages for this thread
    const messages = await openai.beta.threads.messages.list(threadId, { 
      order: "asc",
      limit: 100
    });
    
    // Format the messages for your frontend, filtering out system context
    const formattedMessages = messages.data
      .map(msg => {
        const content = msg.content
          .filter(item => item.type === "text")
          .map(item => item.type === "text" ? item.text.value : null)
          .filter(Boolean)
          .join(" ");
          
        return {
          role: msg.role,
          content: content
        };
      })
      .filter(msg => {
        // Filter out messages that contain user context data
        if (msg.role === "user" && msg.content.includes("User Information:")) {
          return false;
        }
        return true;
      });
    
    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}