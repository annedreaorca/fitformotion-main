// /app/api/ai/route.ts
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  defaultHeaders: {
    'OpenAI-Beta': 'assistants=v2'
  }
});

export const runtime = "nodejs";

// Helper function to calculate age from birthdate
function calculateAge(birthdate: Date): number {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Helper function to wait for OpenAI run completion
async function waitForRunCompletion(runId: string, threadId: string) {
  let currentRun = await openai.beta.threads.runs.retrieve(threadId, runId);
  while (currentRun.status === "queued" || currentRun.status === "in_progress") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    currentRun = await openai.beta.threads.runs.retrieve(threadId, runId);
  }
  return currentRun;
}

export async function POST(req: NextRequest) {
  try {
    const input: { message: string; threadId?: string; isAutoRoutineRequest?: boolean } = await req.json();
    
    // Get the authenticated user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user data from database
    let userData = null;
    try {
      userData = await prisma.userInfo.findUnique({
        where: { userId: userId },
        include: {
          userWeights: true,
        }
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    // Create a new thread if threadId is not provided or use the existing one
    let threadId: string;
    if (!input.threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    } else {
      threadId = input.threadId;
    }
    
    // Prepare user context for the assistant
    let userContext = "";
    if (userData) {
      // Get the latest weight entry if available
      const latestWeight = userData.userWeights.length > 0 
        ? userData.userWeights[userData.userWeights.length - 1]
        : null;
      
      userContext = `
User Information:
- Height: ${userData.height ? `${userData.height} cm` : "Not provided"}
- Weight: ${userData.weight ? `${userData.weight} kg` : "Not provided"}
- Latest Weight Entry: ${latestWeight ? `${latestWeight.weight} kg` : "No weight history"}
- Age: ${userData.birthdate ? calculateAge(new Date(userData.birthdate)) : "Not provided"}
- Fitness Goals: ${userData.fitnessGoals || "Not specified"}
- Experience Level: ${userData.experienceLevel || "Not specified"}
- Weekly Sessions: ${userData.weeklySession || "Not specified"}
- Session Duration: ${userData.sessionTime ? `${userData.sessionTime} minutes` : "Not specified"}
- Subscription Type: ${userData.subscriptionType || "Free"}
- Is New User: ${userData.isNewUser ? "Yes" : "No"}

Please use this information to provide personalized fitness advice and workout recommendations.
`;
    }

    // Add the user message to the thread with context
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userContext + "\n\nUser Message: " + input.message,
    });

    // Start the assistant run
    let run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASSISTANT_ID ?? (() => {
        throw new Error("ASSISTANT_ID is not set");
      })(),
    });

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

    // If this was an auto routine request, mark the user as having received a recommendation
    if (input.isAutoRoutineRequest && userData) {
      try {
        await prisma.userInfo.update({
          where: { userId: userId },
          data: { hasReceivedRoutineRecommendation: true }
        });
      } catch (error) {
        console.error("Error updating routine recommendation status:", error);
      }
    }

    return NextResponse.json({ 
      content: messageContent,
      threadId: threadId
    });
  } catch (error) {
    console.error("Error in AI route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}