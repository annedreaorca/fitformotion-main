import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs";
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

  const query = params.searchParams.search;
  // Fetch all users by default, or search if query is provided
  let users = await clerkClient.users.getUserList({ 
    query: query || undefined,
    limit: 100 // Adjust limit as needed
  });
  
  // Filter to only show members (since only coaches access this page)
  users = users.filter((user) => {
    const role = user.publicMetadata.role as string;
    // Show users with no role (default members) or explicit "member" role
    return !role || role === "member";
  });

  return (
    <>
      <PageHeading title="Coach Dashboard" />
      <p className="mb-3">
        View and manage your members.
      </p>
      <SearchUsers />
      <ul className="space-y-3">
        {users.map((user) => {
          const role = user.publicMetadata.role as string;
          const userType = role || "member";
          const userString = `${user.firstName} ${user.lastName} (${userType})`;
          return (
            <li key={user.id} className="flex justify-between">
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
              <div className="flex gap-3">
                {/* Coaches can view but not modify roles */}
                <span className="text-sm text-gray-500 self-center">
                  {userType === "member" ? "Regular Member" : 
                   userType === "coach" ? "Coach" : 
                   userType === "admin" ? "Administrator" : userType}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}