// C:\Users\anned\Desktop\fitformotion\app\(protected)\profile\page.tsx
import IntroductionWizard from "@/components/IntroductionWizard"; // Import the wizard component
import { ThemeSwitcher } from "@/components/ThemeSwitcher/ThemeSwitcher";
import { startTour } from "@/components/TourGuide/ProfileGuide";
import prisma from "@/prisma/prisma";
import { isProfileComplete } from "@/utils/ProfileCompletion";
import { currentUser } from "@clerk/nextjs";
import { IconWalk } from "@tabler/icons-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileActions from "./_components/ProfileActions";
import ProfileHero from "./_components/ProfileHero";
import ProfileMeasurements from "./_components/ProfileMeasurements";
import ProfileStats from "./_components/ProfileStats";

// Define the updated structure that matches your components
interface UserMeasurements {
  birthdate: Date | null;
  height: number | null;
  weight: number | null;
  fitnessGoals: string | null;
  experienceLevel: string | null;
  weeklySession: number | null;
  sessionTime: number | null; 
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { redirect?: string; allowRedirect?: string; updated?: string };
}) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be signed in to view this page.");
  }

  const userId = user.id;
  const username = user?.username || undefined;
  const firstName = user?.firstName || undefined;
  const lastName = user?.lastName || undefined;
  const userImage = user?.imageUrl || undefined;

  // Calculate profile completion status
  const profileComplete = await isProfileComplete(userId);
  
  // Determine if we're in a forced profile view scenario
  const forceProfileView = searchParams.allowRedirect === "false";
  
  // Check if we're coming back after an update
  const isAfterUpdate = searchParams.updated === "true";
  
  // Determine if we're in an explicit sidebar navigation (user clicked profile)
  const headersList = headers();
  const referer = headersList.get("referer") || "";
  const isComingFromSidebar = referer.includes("/dashboard") || referer.includes("/workouts") || 
                             referer.includes("/nutrition") || referer.includes("/settings");
  
  // Modified Redirect logic:
  // 1. If profile is complete AND
  // 2. We're not forcing profile view AND
  // 3. We're not coming from sidebar navigation AND
  // 4. We're not returning after an update
  // Then redirect to dashboard
  if (profileComplete && !forceProfileView && !isComingFromSidebar && !isAfterUpdate) {
    redirect("/dashboard");
  }

  const userMeasurements = await prisma.userInfo.findUnique({
    where: {
      userId: userId,
    },
    select: {
      birthdate: true,
      height: true,
      weight: true,
      fitnessGoals: true,
      experienceLevel: true,
      weeklySession: true,
      sessionTime: true
    },
  }) as UserMeasurements | null;

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
  
  const isRedirected = searchParams.redirect === "true";
  
  // Calculate completion percentage based on your requirements
  let completionPercentage = 0;
  
  if (userMeasurements) {
    const totalFields = 7; // Total number of fields we're checking
    let completedFields = 0;
    
    if (userMeasurements.birthdate) completedFields++;
    if (userMeasurements.height) completedFields++;
    if (userMeasurements.weight) completedFields++;
    if (userMeasurements.fitnessGoals) completedFields++;
    if (userMeasurements.experienceLevel) completedFields++;
    if (userMeasurements.weeklySession) completedFields++;
    if (userMeasurements.sessionTime) completedFields++;
    
    completionPercentage = Math.round((completedFields / totalFields) * 100);
  }

  return (
    <>
      {/* Introduction Wizard will be shown when profile is complete */}
      <IntroductionWizard />
      
      {isRedirected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-medium">Please complete your profile before exploring other areas of the app.</p>
          <p>Complete the required information below to unlock all features.</p>
        </div>
      )}
      
      {/* Show a success message if returning from update */}
      {isAfterUpdate && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p className="font-medium">Profile updated successfully!</p>
          <p>Your profile has been updated with the latest information.</p>
        </div>
      )}
      
      {!profileComplete && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Profile Completion</h3>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

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

      <ProfileMeasurements 
        userDetails={{
          username: username,
          firstName: firstName,
          lastName: lastName
        }}
        userMeasurements={userMeasurements} 
        equipment={equipment}
        userId={userId}
      />

      <div id="profile-actions">
        <ProfileActions />
      </div>
    </>
  );
}