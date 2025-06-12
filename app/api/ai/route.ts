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

// Helper function to determine optimal routine structure
function getRoutineStructure(weeklySession: number | null, sessionTime: number | null, experienceLevel: string | null): string {
  const session = weeklySession || 3; // Default to 3 if not specified
  const duration = sessionTime || 45; // Default to 60 minutes if not specified
  const experience = experienceLevel?.toLowerCase() || 'beginner';

  let routineStructure = "";

  switch (session) {
    case 1:
      routineStructure = "Full Body Workout - Single session covering all major muscle groups with compound movements";
      break;
    
    case 2:
      routineStructure = "Upper/Lower Split - Day 1: Upper Body (chest, back, shoulders, arms), Day 2: Lower Body (legs, glutes, core)";
      break;
    
    case 3:
      if (experience === 'beginner') {
        routineStructure = "Full Body Split (3x/week) - Each session targets all major muscle groups with progressive overload";
      } else {
        routineStructure = "Push/Pull/Legs Split - Day 1: Push (chest, shoulders, triceps), Day 2: Pull (back, biceps), Day 3: Legs (quads, hamstrings, glutes, calves)";
      }
      break;
    
    case 4:
      routineStructure = "Upper/Lower Split (2x/week) - Day 1: Upper Body, Day 2: Lower Body, Day 3: Upper Body, Day 4: Lower Body";
      break;
    
    case 5:
      routineStructure = "Push/Pull/Legs + Upper/Lower - Day 1: Push, Day 2: Pull, Day 3: Legs, Day 4: Upper Body, Day 5: Lower Body";
      break;
    
    case 6:
      routineStructure = "Push/Pull/Legs (2x/week) - Day 1: Push, Day 2: Pull, Day 3: Legs, Day 4: Push, Day 5: Pull, Day 6: Legs";
      break;
    
    default:
      if (session >= 7) {
        routineStructure = "Advanced Split - Push/Pull/Legs/Push/Pull/Legs/Active Recovery or specialized body part focus";
      } else {
        routineStructure = "Full Body Split - Adapted for your training frequency";
      }
  }

  // Add session duration considerations
  let durationGuidance = "";
  if (duration <= 30) {
    durationGuidance = " Focus on compound movements and supersets for time efficiency.";
  } else if (duration <= 45) {
    durationGuidance = " Include 4-6 exercises per session with moderate rest periods.";
  } else if (duration <= 60) {
    durationGuidance = " Allow for 6-8 exercises with proper rest and warm-up/cool-down.";
  } else {
    durationGuidance = " Extended sessions allow for more volume, accessories, and thorough warm-up/cool-down.";
  }

  return routineStructure + durationGuidance;
}

// Enhanced system prompt for structured routines
function createStructuredRoutinePrompt(userData: any, routineStructure: string): string {
  return `
IMPORTANT: You are a professional fitness AI assistant. When providing workout routines, you must create STRUCTURED, DETAILED programs based on the user's specific training parameters.

USER'S TRAINING PARAMETERS:
- Weekly Training Days: ${userData.weeklySession || 3}
- Session Duration: ${userData.sessionTime || 60} minutes
- Experience Level: ${userData.experienceLevel || 'Beginner'}
- Fitness Goals: ${userData.fitnessGoals || 'General fitness'}

RECOMMENDED ROUTINE STRUCTURE: ${routineStructure}

MANDATORY ROUTINE FORMAT:
1. **Program Overview** - Brief explanation of the chosen split and why it fits their schedule
2. **Weekly Schedule** - Clear day-by-day breakdown
3. **Detailed Workout Days** - For each training day, provide:
   - Day name/focus (e.g., "Day 1: Push Day" or "Day 1: Upper Body")
   - 6-8 specific exercises with:
     - Exercise name
     - Sets x Reps with weight progression
     - Brief form cue or target muscle focus
     - Equipment needed (barbell, dumbbell, cable, machine)
   - Estimated total time
4. **Progression Guidelines** - How to advance week by week
5. **Rest Day Recommendations** - Light stretching, mobility work, or complete rest

STRENGTH TRAINING FOCUS:
- All exercises must use gym equipment (barbells, dumbbells, cables, machines)
- NO cardio exercises - only resistance/weight training
- Focus on compound and isolation movements for muscle building and strength
- Progressive overload is key - increasing weight, reps, or sets over time

EXERCISE SELECTION RULES:
- STRENGTH TRAINING ONLY - No cardio exercises
- Prioritize compound movements (squats, deadlifts, bench press, rows, overhead press)
- Include unilateral exercises for balance (single-arm/leg variations)
- Match exercise difficulty to experience level
- Ensure balanced muscle group coverage
- Use gym equipment: barbells, dumbbells, cables, machines, pull-up bars
- Focus on progressive overload with weights

SETS/REPS GUIDELINES based on goals:
- Strength: 3-5 sets of 3-6 reps with heavy weight
- Muscle Building: 3-4 sets of 6-12 reps with moderate-heavy weight
- Muscular Endurance: 2-3 sets of 12-15 reps with lighter weight
- Mixed goals: Vary rep ranges across exercises

EQUIPMENT-BASED EXERCISE EXAMPLES:
- Barbell: Squats, deadlifts, bench press, rows, overhead press
- Dumbbells: Chest press, rows, shoulder press, lunges, curls
- Cables: Lat pulldowns, cable rows, tricep pushdowns, lateral raises
- Machines: Leg press, chest fly, shoulder press, leg curls

Always provide a complete, actionable routine that the user can follow immediately. Do not give generic advice - give them their personalized program structure.
`;
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
    let enhancedPrompt = "";
    
    if (userData) {
      // Get the latest weight entry if available
      const latestWeight = userData.userWeights.length > 0 
        ? userData.userWeights[userData.userWeights.length - 1]
        : null;
      
      // Get recommended routine structure
      const routineStructure = getRoutineStructure(
        userData.weeklySession, 
        userData.sessionTime, 
        userData.experienceLevel
      );
      
      userContext = `
User Profile Information:
- Height: ${userData.height ? `${userData.height} cm` : "Not provided"}
- Weight: ${userData.weight ? `${userData.weight} kg` : "Not provided"}
- Latest Weight Entry: ${latestWeight ? `${latestWeight.weight} kg` : "No weight history"}
- Age: ${userData.birthdate ? calculateAge(new Date(userData.birthdate)) : "Not provided"}
- Fitness Goals: ${userData.fitnessGoals || "Not specified"}
- Experience Level: ${userData.experienceLevel || "Not specified"}
- Weekly Training Sessions: ${userData.weeklySession || "Not specified"}
- Session Duration: ${userData.sessionTime ? `${userData.sessionTime} minutes` : "Not specified"}
- Subscription Type: ${userData.subscriptionType || "Free"}
- Is New User: ${userData.isNewUser ? "Yes" : "No"}
`;

      // If this is an auto routine request or the user is asking for a routine, use enhanced prompt
      if (input.isAutoRoutineRequest || 
          input.message.toLowerCase().includes('routine') || 
          input.message.toLowerCase().includes('workout') ||
          input.message.toLowerCase().includes('program')) {
        enhancedPrompt = createStructuredRoutinePrompt(userData, routineStructure);
      }
    }

    // Combine the prompts appropriately
    const fullPrompt = enhancedPrompt ? 
      `${enhancedPrompt}\n\n${userContext}\n\nUser Message: ${input.message}` :
      `${userContext}\n\nUser Message: ${input.message}`;

    // Add the user message to the thread with context
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: fullPrompt,
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