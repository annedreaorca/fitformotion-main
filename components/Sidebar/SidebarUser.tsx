"use client";
import { useSidebarToggleContext } from "@/contexts/SidebarToggleContext";
import { Avatar } from "@nextui-org/avatar";
import { User } from "@nextui-org/user";

export default function SidebarUser({
  username,
  userImage,
}: {
  username?: string;
  userImage?: string;
}) {
  const { sidebarCollapse } = useSidebarToggleContext();

  return (
    <div className={`px-5 mb-4 ${sidebarCollapse ? 'p-0 border-none' : ''}`}>
      <a href="/profile">
        <div className={`flex items-center ${sidebarCollapse ? 'px-0 py-[5px] bg-transparent' : 'px-[10px] py-[5px] bg-gray-200 dark:bg-zinc-800 border-l-2 border-[#991b1b] rounded-[100px]'}`}>
          
          {!sidebarCollapse && (
            <User
              name={username || "Unknown"}
              description="Free Plan"
              avatarProps={{
                src: userImage || "default-image-url",
              }}
              classNames={{
                description: "text-zinc-600 dark:text-zinc-400",
              }}
            />
          )}
    
          {sidebarCollapse && (
            <div className="flex justify-center">
              <Avatar
                showFallback
                name={username || "Unknown"}
                src={userImage || "default-image-url"}
              />
            </div>
          )}
        </div>
      </a>
    </div>
  );
}
