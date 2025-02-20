import prisma from "@/prisma/prisma";
import { currentUser } from "@clerk/nextjs";

import { ThemeSwitcher } from "@/components/ThemeSwitcher/ThemeSwitcher";
import { startTour } from "@/components/TourGuide/ProfileGuide";
import { IconWalk } from "@tabler/icons-react";
import ProfileActions from "./_components/ProfileActions";
import ProfileDetails from "./_components/ProfileDetails";
import ProfileEquipment from "./_components/ProfileEquipment";
import ProfileHero from "./_components/ProfileHero";
import ProfileMeasurements from "./_components/ProfileMeasurements";
import ProfileStats from "./_components/ProfileStats";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be signed in to view this page.");
  }

  const userId = user.id;
  const username = user?.username || undefined;
  const firstName = user?.firstName || undefined;
  const lastName = user?.lastName || undefined;
  const userImage = user?.imageUrl || undefined;

  const userMeasurements = await prisma.userInfo.findUnique({
    where: {
      userId: userId,
    },
    select: {
      age: true,
      height: true,
      weight: true,
    },
  });

  const equipmentObjects = await prisma.userEquipment.findMany({
    where: {
      userId: userId,
    },
    select: {
      equipmentType: true,
    },
  });

  const equipment = equipmentObjects.map(
    (obj: { equipmentType: string }) => obj.equipmentType
  );

  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={startTour}
          className="p-[5px] bg-zinc-800 text-white rounded-full hover:bg-zinc-700 w-10 h-10 flex items-center justify-center"
        >
          <IconWalk size={22} />
        </button>
      </div>

      <div id="profile-hero">
        <ProfileHero userImage={userImage} username={username} />
      </div>

      {userMeasurements && (
        <div id="profile-stats">
          <ProfileStats userMeasurements={userMeasurements} />
        </div>
      )}

      <div id="theme-switcher" className="flex justify-center py-2 mb-3">
        <ThemeSwitcher />
      </div>

      <div id="profile-details">
        <ProfileDetails
          username={username}
          firstName={firstName}
          lastName={lastName}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        <div id="profile-measurements">
          <ProfileMeasurements userMeasurements={userMeasurements} />
        </div>
        <div id="profile-equipment">
          <ProfileEquipment equipment={equipment} />
        </div>
      </div>

      <div id="profile-actions">
        <ProfileActions />
      </div>
    </>
  );
}
