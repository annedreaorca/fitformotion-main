// app/(protected)/select-coach/page.tsx
import PageHeading from "@/components/PageHeading/PageHeading";
import { isAdmin, isCoach } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs";
import {
  IconClick
} from "@tabler/icons-react";
import { redirect } from "next/navigation";
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
    <div className="page-container">
      <PageHeading title="Select Your Coach" />
      <p className="mt-4 mb-6">
        Choose a coach to guide your fitness journey. You can change your selection at any time.
      </p>
      
      {coaches.length === 0 ? (
        <p className="text-gray-500">No coaches are currently available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      )}
    </div>
  );
}

function CoachCard({ coach }: { coach: any }) {
  const metadata = coach.publicMetadata;
  const primaryEmail = coach.emailAddresses.find(
    (email: any) => email.id === coach.primaryEmailAddressId,
  )?.emailAddress;

  const contactInfo = {
    contact: metadata.contact || metadata.phone,
    email: primaryEmail,
    facebook: metadata.facebook,
    instagram: metadata.instagram,
    tiktok: metadata.tiktok,
    website: metadata.website,
    otherLinks: metadata.otherLinks
  };

  return (
    <div className="h-[420px] relative overflow-hidden rounded-[10px] bg-[#080808] border border-zinc-900 group cursor-pointer">
      {/* Coach Image */}
      <div className="h-full w-full">
        <img
          src={coach.imageUrl || "/images/coach-placeholder.jpg"}
          alt={`${coach.firstName} ${coach.lastName}`}
          className="grayscale group-hover:grayscale-0 transition-all duration-300 object-cover h-full w-full"
        />
      </div>

      {/* Always visible hover indicator */}
      <div className="absolute bottom-4 right-4 bg-zinc-900/50 text-white p-2 rounded-full z-10 transition-all duration-300 flex items-center gap-1">
        <IconClick size={20} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Coach Info */}
      <div className="absolute inset-0 p-[10px] z-[2] flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col gap-[10px] px-[20px] py-[20px] rounded-[10px] bg-black/30 backdrop-blur-sm">
          {/* Coach Name and Nickname */}
          <div className="flex justify-start">
            <span  className="profile-title">
              {/* {metadata.nickname || `${coach.firstName} ${coach.lastName}`} */}
              Coach {coach.lastName} 
            </span>
          </div>
          
          <div className="pt-[10px]">
            <div className="pl-[10px] border-l border-l-zinc-500">
              <div className="flex flex-col pl-[10px] gap-[2px]">
                <div className="flex flex-col gap-[8px]">
                  <h3 className="text-[20px] leading-[24px] text-white">
                    {coach.firstName} {coach.lastName}
                  </h3>
                  {metadata.title && (
                    <span className="text-[14px] text-zinc-300">
                      {metadata.title}
                    </span>
                  )}
                  {primaryEmail && (
                    <span className="text-[12px] text-zinc-400">
                      {primaryEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact buttons */}
            {/* <div className="mt-[20px] flex flex-wrap gap-[10px]">
              {contactInfo.contact && (
                <div className="p-[5px] rounded bg-zinc-800 duration-300 hover:bg-zinc-700">
                  <a
                    href={`tel:${contactInfo.contact}`}
                    className="text-zinc-500 hover:text-white transition-colors duration-300"
                    title="Call"
                  >
                    <IconPhone
                      size={20}
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                  </a>
                </div>
              )}

              {contactInfo.email && (
                <div className="p-[5px] rounded bg-zinc-800 duration-300 hover:bg-zinc-700">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-zinc-500 hover:text-white transition-colors duration-300"
                    title="Email"
                  >
                    <IconMail
                      size={20}
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                  </a>
                </div>
              )}

              {contactInfo.facebook && (
                <div className="p-[5px] rounded bg-zinc-800 duration-300 hover:bg-zinc-700">
                  <a
                    href={contactInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors duration-300"
                    title="Facebook"
                  >
                    <IconBrandFacebook
                      size={20}
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                  </a>
                </div>
              )}

              {contactInfo.instagram && (
                <div className="p-[5px] rounded bg-zinc-800 duration-300 hover:bg-zinc-700">
                  <a
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors duration-300"
                    title="Instagram"
                  >
                    <IconBrandInstagram
                      size={20}
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                  </a>
                </div>
              )}

              {contactInfo.tiktok && (
                <div className="p-[5px] rounded bg-zinc-800 duration-300 hover:bg-zinc-700">
                  <a
                    href={contactInfo.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors duration-300"
                    title="TikTok"
                  >
                    <IconBrandTiktok
                      size={20}
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                  </a>
                </div>
              )}

              {contactInfo.website && (
                <div className="p-[5px] rounded bg-zinc-800 duration-300 hover:bg-zinc-700">
                  <a
                    href={contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors duration-300"
                    title="Website"
                  >
                    <IconWorld
                      size={20}
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                  </a>
                </div>
              )}

              {contactInfo.otherLinks &&
                contactInfo.otherLinks.map((link: any, index: number) => (
                  <div key={index} className="p-[5px] rounded bg-zinc-800 duration-300 hover:bg-zinc-700">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white transition-colors duration-300"
                      title="Other Link"
                    >
                      <IconLink
                        size={20}
                        className="transition-transform duration-300 transform hover:scale-110"
                      />
                    </a>
                  </div>
                ))}
            </div> */}

            {/* Select Coach Button */}
            <div className="mt-[20px] w-full">
              <SelectCoachForm 
                coachId={coach.id} 
                coachName={`${coach.firstName} ${coach.lastName}`} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}