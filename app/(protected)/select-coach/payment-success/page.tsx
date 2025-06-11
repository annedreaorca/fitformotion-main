import { clerkClient } from "@clerk/nextjs";  
import { updateUserCoach } from "../actions";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

interface PageProps {
  searchParams: {
    coachId?: string;
    coachName?: string;
  };
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { userId } = auth();
  const { coachId, coachName } = searchParams;

  if (!userId || !coachId || !coachName) {
    redirect("/select-coach");
  }

  try {
    // Update user's coach assignment
    await updateUserCoach(userId, coachId, decodeURIComponent(coachName));
    
    // Also add this coach to paid coaches list
    const user = await clerkClient.users.getUser(userId);
    const paidCoachIds = (user.publicMetadata.paidCoachIds as string[]) || [];
    
    if (!paidCoachIds.includes(coachId)) {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          paidCoachIds: [...paidCoachIds, coachId]
        }
      });
    }
    
  } catch (error) {
    console.error("Error updating user after payment:", error);
  }

  return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
        <p className="text-zinc-400">
          You have successfully selected Coach {decodeURIComponent(coachName)} as your fitness coach.
        </p>
        <div className="mt-6">
          <a 
            href="/select-coach" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Coach Selection
          </a>
        </div>
      </div>
    </div>
  );
}