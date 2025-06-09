import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import PageHeading from "@/components/PageHeading/PageHeading";
import { User } from "@nextui-org/user";

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
    limit: 100 // Adjust limit as needed
  });
  
  // Filter to only show members assigned to this coach
  users = users.filter((user) => {
    const role = user.publicMetadata.role as string;
    const userCoachId = user.publicMetadata.coachId as string;
    
    // Only show members (users with no role or explicit "member" role)
    // AND who are assigned to this coach
    const isMember = !role || role === "member";
    const isAssignedToThisCoach = userCoachId === coachId;
    
    return isMember && isAssignedToThisCoach;
  });

  return (
    <>
      <PageHeading title="My Members" />
      <p className="mb-3">
        View and manage members assigned to you. {users.length > 0 ? `You have ${users.length} assigned member${users.length === 1 ? '' : 's'}.` : ''}
      </p>
      
      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">You don't have any assigned members yet.</p>
          <p className="text-sm text-gray-400">
            Members can select you as their coach from the "Select Coach" page.
          </p>
        </div>
      ) : (
        <>
          <SearchUsers />
          <ul className="space-y-3">
            {users.map((user) => {
              const role = user.publicMetadata.role as string;
              const userType = role || "member";
              const userString = `${user.firstName} ${user.lastName}`;
              return (
                <li key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
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
                  <div className="flex gap-3 items-center">
                    <span className="text-sm text-green-600 font-medium">
                      Your Member
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}