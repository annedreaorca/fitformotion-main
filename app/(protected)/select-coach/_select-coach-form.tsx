// app/(protected)/select-coach/_select-coach-form.tsx
"use client";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { updateUserCoach, removeUserCoach } from "./actions";

interface SelectCoachFormProps {
  coachId: string;
  coachName: string;
}

export const SelectCoachForm = ({ coachId, coachName }: SelectCoachFormProps) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if this coach is already selected
  const currentCoachId = user?.publicMetadata?.coachId as string;
  const isCurrentCoach = currentCoachId === coachId;

  const handleSelectCoach = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const result = await updateUserCoach(user.id, coachId, coachName);
      if (result.success) {
        // Refresh the page to show updated state
        window.location.reload();
      } else {
        alert("Failed to select coach. Please try again.");
      }
    } catch (error) {
      console.error("Error selecting coach:", error);
      alert("Failed to select coach. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoach = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const result = await removeUserCoach(user.id);
      if (result.success) {
        window.location.reload();
      } else {
        alert("Failed to remove coach. Please try again.");
      }
    } catch (error) {
      console.error("Error removing coach:", error);
      alert("Failed to remove coach. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCurrentCoach) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-green-600 font-medium">Your Coach</span>
        <Button
          size="sm"
          variant="bordered"
          color="danger"
          onPress={handleRemoveCoach}
          isLoading={isLoading}
        >
          Remove
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      color="primary"
      onPress={handleSelectCoach}
      isLoading={isLoading}
      disabled={!!currentCoachId} // Disable if user already has a coach
    >
      {currentCoachId ? "Switch to This Coach" : "Select Coach"}
    </Button>
  );
};