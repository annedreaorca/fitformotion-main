import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { setRole } from "./_actions";
import { SearchUsers } from "./_search-users";

import PageHeading from "@/components/PageHeading/PageHeading";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import { IconChevronLeft, IconChevronRight, IconUsers } from "@tabler/icons-react";
import Link from "next/link";

const USERS_PER_PAGE = 10;

export default async function AdminDashboard(params: {
  searchParams: { search?: string; page?: string };
}) {
  // Note: checkRole is now async
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }

  const query = params.searchParams.search;
  const currentPage = parseInt(params.searchParams.page || "1");
  const offset = (currentPage - 1) * USERS_PER_PAGE;

  // Fetch users with pagination
  const users = await clerkClient.users.getUserList({ 
    query: query || undefined,
    limit: USERS_PER_PAGE,
    offset: offset
  });

  // Get total count for pagination (you might need to make a separate call for this)
  // Since Clerk doesn't return total count in the response, we'll estimate based on returned results
  const hasMoreUsers = users.length === USERS_PER_PAGE;
  const totalPages = hasMoreUsers ? currentPage + 1 : currentPage;

  // Build URL parameters for pagination links
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (page > 1) params.set('page', page.toString());
    return params.toString() ? `?${params.toString()}` : '';
  };

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
          <PageHeading title="Admin Dashboard" />

          <p className="mt-3 mb-6">
            This page is restricted to users with the &apos;admin&apos; role.
          </p>
        </div>
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto justify-items-end">
        {/* Total Users Count Card */}
          <Card className="w-full sm:w-[300px] mb-6">
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg">
                <IconUsers className="w-6 h-6" />
              </div>
              <div className="items-start">
                <h3 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100">
                  {users.length}
                </h3>
                <p className="text-gray-500 text-[14px]">
                  {query ? 'Filtered' : 'Total'} {users.length === 1 ? 'User' : 'Users'}
                  {query && ` (Page ${currentPage})`}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
     

      <SearchUsers />
      {/* Users List */}
      <ul className="space-y-3 mb-8  rounded-lg shadow-md">
        {users.map((user) => {
          const role = user.publicMetadata.role as string;
          const userType = role || "member";
          const userString = `${user.firstName} ${user.lastName} (${userType})`;

          return (
            <li key={user.id} className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 rounded-[10px]">
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
      <div className="flex flex-col md:flex-row items-center gap-4 mt-6 mb-20">
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
          {/* Pagination Info */}
          {(query || currentPage > 1) && (
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                {query && `Search results for "${query}" • `}
                Page {currentPage}
                {users.length > 0 && ` • Showing ${offset + 1}-${offset + users.length} users`}
              </p>
            </div>
          )}

          {users.length === 0 && query && (
            <p className="text-gray-500 mb-4">No users found for &quot;{query}&quot;</p>
          )}

          {users.length === 0 && !query && (
            <p className="text-gray-500 mb-4">No users found in the system.</p>
          )}
        </div>
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
          {/* Pagination Controls */}
          {(users.length > 0 && (hasMoreUsers || currentPage > 1)) && (
            <div className="flex justify-end items-center gap-4">
              <div className="flex gap-2">
                {/* Previous Page Button */}
                {currentPage > 1 && (
                  <Button
                    as={Link}
                    href={buildUrl(currentPage - 1)}
                    variant="bordered"
                    size="sm"
                    startContent={<IconChevronLeft size={16} />}
                  >
                  </Button>
                )}

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {currentPage > 2 && (
                    <>
                      <Button
                        as={Link}
                        href={buildUrl(1)}
                        variant="light"
                        size="sm"
                      >
                        1
                      </Button>
                      {currentPage > 3 && (
                        <span className="px-2 py-1 text-sm text-gray-500">...</span>
                      )}
                    </>
                  )}
                  
                  {currentPage > 1 && (
                    <Button
                      as={Link}
                      href={buildUrl(currentPage - 1)}
                      variant="light"
                      size="sm"
                    >
                      {currentPage - 1}
                    </Button>
                  )}
                  
                  <Button
                    variant="solid"
                    color="primary"
                    size="sm"
                    className="cursor-default"
                  >
                    {currentPage}
                  </Button>
                  
                  {hasMoreUsers && (
                    <Button
                      as={Link}
                      href={buildUrl(currentPage + 1)}
                      variant="light"
                      size="sm"
                    >
                      {currentPage + 1}
                    </Button>
                  )}
                </div>

                {/* Next Page Button */}
                {hasMoreUsers && (
                  <Button
                    as={Link}
                    href={buildUrl(currentPage + 1)}
                    variant="bordered"
                    size="sm"
                    endContent={<IconChevronRight size={16} />}
                  >
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}