// app/(protected)/coach-users/page.tsx
import PageHeading from "@/components/PageHeading/PageHeading";
import { checkRole } from "@/utils/roles";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { User } from "@nextui-org/user";
import { redirect } from "next/navigation";
import { SearchUsers } from "./_search-users";
import { getUserAnalytics, getUserRecentActivity } from "./actions";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { IconCalendarWeek, IconWeight, IconHourglass, IconHeartFilled, IconChartBar } from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function CoachDashboard(params: {
  searchParams: { search?: string };
}) {
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

  const query = params.searchParams.search;
  // Fetch all users by default, or search if query is provided
  let users = await clerkClient.users.getUserList({ 
    query: query || undefined,
    limit: 100
  });
  
  // Filter to only show members assigned to this coach
  users = users.filter((user) => {
    const role = user.publicMetadata.role as string;
    const userCoachId = user.publicMetadata.coachId as string;
    
    const isMember = !role || role === "member";
    const isAssignedToThisCoach = userCoachId === coachId;
    
    return isMember && isAssignedToThisCoach;
  });

  // Fetch analytics and recent activity for each user
  const usersWithAnalytics = await Promise.all(
    users.map(async (user) => {
      const [analytics, recentActivity] = await Promise.all([
        getUserAnalytics(user.id),
        getUserRecentActivity(user.id)
      ]);
      return {
        ...user,
        analytics,
        recentActivity
      };
    })
  );

  return (
    <div className="page-container">
      <PageHeading title="My Members" />
      <p className="mt-3 mb-6">
        View and manage members assigned to you. {users.length > 0 ? `You have ${users.length} assigned member${users.length === 1 ? '' : 's'}.` : ''}
      </p>
      
      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">You don&apos;t have any assigned members yet.</p>
          <p className="text-sm text-gray-400">
            Members can select you as their coach from the &apos;Select Coach&apos; page.
          </p>
        </div>
      ) : (
        <>
          <SearchUsers />
          <div className="space-y-6">
            {usersWithAnalytics.map((user) => {
              const userString = `${user.firstName} ${user.lastName}`;
              const { analytics, recentActivity } = user;
              
              return (
                <Card key={user.id} className="p-4">
                  <CardBody>
                    {/* User Info Header */}
                    <div className="flex justify-between items-center mb-4">
                      <User
                        name={userString}
                        description={
                          user.emailAddresses.find(
                            (email) => email.id === user.primaryEmailAddressId,
                          )?.emailAddress
                        }
                        avatarProps={{
                          src: user.imageUrl,
                        }}
                        classNames={{ description: "text-zinc-500" }}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="bordered"
                          startContent={<IconChartBar className="w-4 h-4" />}
                          as={Link}
                          href={`/coach-users/${user.id}/analytics`}
                        >
                          View Analytics
                        </Button>
                        <span className="text-sm text-green-600 font-medium self-center">
                          Your Member
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}