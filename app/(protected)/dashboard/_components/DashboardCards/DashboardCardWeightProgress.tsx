import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { IconWeight } from "@tabler/icons-react";
import DashboardCardTemplate from "./DashboardCardTemplate";

export default async function DashboardCardWeightProgress() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  // Fetch the latest user weight record
  const latestWeight = await prisma.userWeight.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      recordedAt: "desc", // Get the most recent weight
    },
    select: {
      weight: true,
      recordedAt: true,
    },
  });

  // Fetch user profile info to get their default weight if no records exist
  const userInfo = await prisma.userInfo.findUnique({
    where: {
      userId: userId,
    },
    select: {
      weight: true,
    },
  });
  
  // Use the profile weight as default if available, otherwise fallback to a standard value
  const defaultWeight = userInfo?.weight || "No weight input yet"; // Using 70kg as fallback (adjust as needed)
  const weight = latestWeight?.weight || defaultWeight;
  
  // Format date if available
  const recordedDate = latestWeight?.recordedAt 
    ? new Date(latestWeight.recordedAt).toLocaleDateString() 
    : "No recorded data yet";

  return (
    <DashboardCardTemplate
      title="Current Weight"
      icon={<IconWeight className="text-primary" />}
    >
      <div>
        <span className="text-lg font-medium">{weight} kg</span>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Last recorded: {recordedDate}
        </div>
      </div>
    </DashboardCardTemplate>
  );
}