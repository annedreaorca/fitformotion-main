// app/(protected)/coach-users/[userId]/analytics/page.tsx
import PageHeading from "@/components/PageHeading/PageHeading";
import { checkRole } from "@/utils/roles";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { Avatar } from "@nextui-org/avatar"; // Import Avatar component
import { Button } from "@nextui-org/button";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CoachUserProgressCharts } from "./CoachUserProgressCharts";

interface Props {
  params: {
    userId: string;
  };
}

export default async function CoachUserAnalytics({ params }: Props) {
  // Check if user is coach (but not admin)
  const isCoach = await checkRole("coach");
  const isAdmin = await checkRole("admin");
  
  // Only allow coaches, not admins
  if (!isCoach || isAdmin) {
    redirect("/");
  }

  // Get current coach's ID
  const currentCoach = await currentUser();
  const coachId = currentCoach?.id;

  if (!coachId) {
    redirect("/");
  }

  // Get the user being analyzed
  const user = await clerkClient.users.getUser(params.userId);
  
  // Verify this user is assigned to this coach
  const userCoachId = user.publicMetadata.coachId as string;
  if (userCoachId !== coachId) {
    redirect("/coach-users");
  }

  const userString = `${user.firstName} ${user.lastName}`;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-5">
          {/* Option 1: Just the Avatar component */}
          <Avatar
            src={user.imageUrl}
            size="lg"
            name={userString} // Fallback initials if no image
            className="ring-2 ring-primary-500" // Optional styling
          />
          
          {/* User info alongside avatar */}
          <div>
            <PageHeading title={`${userString}`} />
            <p className="text-gray-500 mt-2">
              Detailed progress tracking and performance metrics
            </p>
          </div>
        </div>
        
        <Button
          as={Link}
          href="/coach-users"
          variant="light"
          isIconOnly
          aria-label="Back to members"
          className="bg-white dark:bg-zinc-800 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-gray-300 w-auto"
        >
          <IconArrowLeft className="w-6 h-6 text-zinc-950 dark:text-white"/>
          <p className="hidden pl-[5px] sm:block font-[400] text-zinc-950 dark:text-white">Back to Clients</p>
        </Button>
      </div>

      {/* Progress Charts */}
      <CoachUserProgressCharts userId={params.userId} />
    </div>
  );
}