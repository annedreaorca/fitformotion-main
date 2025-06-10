import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs";
import { setRole } from "./_actions";

import PageHeading from "@/components/PageHeading/PageHeading";
import { User } from "@nextui-org/user";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { IconUsers } from "@tabler/icons-react";

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  // Note: checkRole is now async
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }

  const query = params.searchParams.search;

  // Fetch all users by default, or search if query is provided
  const users = await clerkClient.users.getUserList({ 
    query: query || undefined,
    limit: 100 // Adjust limit as needed
  });

  return (
    <>
      <PageHeading title="Admin Dashboard" />
      
      {/* Total Users Count Card */}
      <Card className="mb-6">
        <CardBody className="flex flex-row items-center gap-4 p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
            <IconUsers className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {users.length}
            </h3>
            <p className="text-gray-600">
              Total {users.length === 1 ? 'User' : 'Users'}
            </p>
          </div>
        </CardBody>
      </Card>

      <p className="mb-3">
        This page is restricted to users with the &apos;admin&apos; role.
      </p>

      <SearchUsers />

      {users.length === 0 && query && (
        <p className="text-gray-500 mb-4">No users found for &quot;{query}&quot;</p>
      )}

      {users.length === 0 && !query && (
        <p className="text-gray-500 mb-4">No users found in the system.</p>
      )}

      <ul className="space-y-3">
        {users.map((user) => {
          const role = user.publicMetadata.role as string;
          const userType = role || "member";
          const userString = `${user.firstName} ${user.lastName} (${userType})`;

          return (
            <li key={user.id} className="flex justify-between items-center p-4">
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
                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="admin" name="role" />
                  <Button 
                    type="submit" 
                    size="sm"
                    color={userType === "admin" ? "success" : "default"}
                    variant={userType === "admin" ? "solid" : "bordered"}
                  >
                    {userType === "admin" ? "✓ Admin" : "Make Admin"}
                  </Button>
                </form>

                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="coach" name="role" />
                  <Button 
                    type="submit" 
                    size="sm"
                    color={userType === "coach" ? "success" : "default"}
                    variant={userType === "coach" ? "solid" : "bordered"}
                  >
                    {userType === "coach" ? "✓ Coach" : "Make Coach"}
                  </Button>
                </form>

                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="" name="role" />
                  <Button 
                    type="submit" 
                    size="sm" 
                    color={userType === "member" ? "success" : "default"}
                    variant={userType === "member" ? "solid" : "light"}
                  >
                    {userType === "member" ? "✓ Member" : "Make Member"}
                  </Button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}