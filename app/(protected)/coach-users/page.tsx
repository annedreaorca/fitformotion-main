// app/(protected)/coach-users/page.tsx
import PageHeading from "@/components/PageHeading/PageHeading";
import { checkRole } from "@/utils/roles";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import { IconChartBar, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchUsers } from "./_search-users";
import { getUserAnalytics, getUserRecentActivity } from "./actions";

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
      <PageHeading title="Clients" />

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-[20px] border border-zinc-300 dark:border-zinc-900 rounded-[30px] my-6 ">
            {usersWithAnalytics.map((user) => {
              const userString = `${user.firstName} ${user.lastName}`;
              const { analytics, recentActivity } = user;
              
              return (
                <Card key={user.id} className="px-3 py-3 relative ">
                  <CardBody>
                    {/* User Info Header */}
                    <div className="flex flex-col">
                      <User
                        name={userString}
                        description={
                          user.emailAddresses.find(
                            (email) => email.id === user.primaryEmailAddressId,
                          )?.emailAddress
                        }
                        avatarProps={{
                          src: user.imageUrl,
                          className: "w-[120px] h-[120px] rounded-full",
                        }}
                        classNames={{
                          base: "flex flex-col items-center text-center gap-2 w-full justify-center",
                          wrapper: "flex flex-col items-center justify-center",
                          name: "text-center text-[18px] w-full justify-center",
                          description: "text-center text-zinc-500 text-sm w-full justify-center",
                        }}
                        className="flex flex-col justify-center items-center gap-2 mb-4 text-center w-full"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          color="primary"
                          variant="bordered"
                          startContent={<IconChartBar className="w-4 h-4" />}
                          as={Link}
                          href={`/coach-users/${user.id}/analytics`}
                          className="bg-primary-800 text-white border-1 border-primary-800 mt-2"
                        >
                          View Analytics
                        </Button>
                        <span className="text-[12px] bg-[#24551838] py-[5px] px-[8px] text-green-800 dark:text-green-600 rounded-full font-medium self-center absolute top-0 right-0">
                          Member
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
      
      <Card className="w-full sm:w-[300px]">
        <CardBody className="flex flex-row items-center gap-4 p-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg">
            <IconUsers className="w-6 h-6" />
          </div>
          <div className="flexitems-start">
            <h3 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100">
              {users.length}
            </h3>
            <p className="text-gray-500 text-[14px]">
              Total {users.length === 1 ? 'Member' : 'Clients'} Enrolled
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}