// app/(protected)/select-coach/page.tsx
import { redirect } from "next/navigation";
import { isAdmin, isCoach } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs";
import PageHeading from "@/components/PageHeading/PageHeading";
import { User } from "@nextui-org/user";
import { Button } from "@nextui-org/button";
import { SelectCoachForm } from "./_select-coach-form";

export default async function SelectCoachPage() {
  // Check if user is NOT coach or admin (allow members and users without roles)
  const userIsCoach = await isCoach();
  const userIsAdmin = await isAdmin();
  
  // Only allow members (not coaches or admins)
  if (userIsCoach || userIsAdmin) {
    redirect("/");
  }

  // Fetch all coaches
  const allUsers = await clerkClient.users.getUserList({ 
    limit: 100 
  });
  
  // Filter to only show coaches
  const coaches = allUsers.filter((user) => {
    const role = user.publicMetadata.role as string;
    return role === "coach";
  });

  return (
    <>
      <PageHeading title="Select Your Coach" />
      <p className="mb-6">
        Choose a coach to guide your fitness journey. You can change your selection at any time.
      </p>
      
      {coaches.length === 0 ? (
        <p className="text-gray-500">No coaches are currently available.</p>
      ) : (
        <div className="space-y-4">
          {coaches.map((coach) => (
            <div key={coach.id} className="border rounded-lg p-4 flex justify-between items-center">
              <User
                name={`${coach.firstName} ${coach.lastName}`}
                description={
                  coach.emailAddresses.find(
                    (email) => email.id === coach.primaryEmailAddressId,
                  )?.emailAddress
                }
                avatarProps={{
                  src: coach.imageUrl,
                }}
                classNames={{ 
                  description: "text-zinc-500",
                  name: "font-semibold"
                }}
              />
              <SelectCoachForm coachId={coach.id} coachName={`${coach.firstName} ${coach.lastName}`} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}