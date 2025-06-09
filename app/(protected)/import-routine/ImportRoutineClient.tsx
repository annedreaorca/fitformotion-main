"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { IconDownload, IconArrowLeft, IconBarbell } from "@tabler/icons-react";
import { toast } from "sonner";
import PageHeading from "@/components/PageHeading/PageHeading";

type Exercise = {
  id: string;
  name: string;
  category: string;
};

type WorkoutPlanExercise = {
  Exercise: Exercise;
  sets: number;
  reps: number | null;
  exerciseDuration: number | null;
  trackingType: string | null;
  order: number | null;
};

type ExtendedWorkoutPlan = {
  id: string;
  name: string;
  notes: string | null;
  userId: string;
  WorkoutPlanExercise: WorkoutPlanExercise[];
};

interface ImportRoutineClientProps {
  routine: ExtendedWorkoutPlan;
  shareId: string;
}

export default function ImportRoutineClient({
  routine,
  shareId,
}: ImportRoutineClientProps) {
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const response = await fetch(`/api/routines/import/${shareId}`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Routine imported successfully!");
        router.push("/workout");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to import routine");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import routine");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="light"
          startContent={<IconArrowLeft size={20} />}
          onClick={() => router.back()}
          className="mb-4"
        >
          Back
        </Button>
        <PageHeading title="Import Routine" />
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Preview and import this shared workout routine
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="text-2xl font-bold">{routine.name}</h2>
                {routine.notes && (
                  <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                    {routine.notes}
                  </p>
                )}
              </div>
              <Button
                color="primary"
                size="lg"
                onClick={handleImport}
                isLoading={isImporting}
                startContent={!isImporting && <IconDownload size={20} />}
              >
                {isImporting ? "Importing..." : "Import Routine"}
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <IconBarbell size={16} />
                <span>{routine.WorkoutPlanExercise.length} exercises</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Exercises</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {routine.WorkoutPlanExercise.map((exercise, index) => (
                <div
                  key={exercise.Exercise.id}
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{exercise.Exercise.name}</h4>
                      <Chip size="sm" variant="flat" className="mt-1">
                        {exercise.Exercise.category}
                      </Chip>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">
                      {exercise.sets} set{exercise.sets !== 1 ? "s" : ""}
                    </div>
                    {exercise.reps && (
                      <div className="text-zinc-600 dark:text-zinc-400">
                        {exercise.reps} reps
                      </div>
                    )}
                    {exercise.exerciseDuration && (
                      <div className="text-zinc-600 dark:text-zinc-400">
                        {exercise.exerciseDuration}s
                      </div>
                    )}
                    {exercise.trackingType && (
                      <div className="text-zinc-600 dark:text-zinc-400">
                        {exercise.trackingType}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}