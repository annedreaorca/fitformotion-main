// app/(protected)/coach-users/[userId]/analytics/page.tsx
import PageHeading from "@/components/PageHeading/PageHeading";
import { checkRole } from "@/utils/roles";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { User } from "@nextui-org/user";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { IconArrowLeft, IconCalendarStats, IconWeight, IconHourglass, IconChartBar } from "@tabler/icons-react";
import Link from "next/link";
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
      <div className="flex items-center gap-4 mb-6">
        <Button
          as={Link}
          href="/coach-users"
          variant="light"
          isIconOnly
          aria-label="Back to members"
        >
          <IconArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <PageHeading title={`${userString}'s Analytics`} />
          <p className="text-gray-500 mt-1">
            Detailed progress tracking and performance metrics
          </p>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <User
            name={userString}
            description={
              user.emailAddresses.find(
                (email) => email.id === user.primaryEmailAddressId,
              )?.emailAddress
            }
            avatarProps={{
              src: user.imageUrl,
              size: "lg"
            }}
            classNames={{ 
              description: "text-zinc-500",
              name: "text-lg font-semibold"
            }}
          />
        </CardBody>
      </Card>

      {/* Progress Charts */}
      <CoachUserProgressCharts userId={params.userId} />
    </div>
  );
}