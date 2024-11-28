"use client";
import UploadForm from "@/app/form"; // Ensure correct import path
import ExerciseOrderIndicator from "@/components/Generic/ExerciseOrderIndicator";
import { useConfetti } from "@/contexts/ConfettiContext";
import { useWorkoutControls } from "@/contexts/WorkoutControlsContext";
import { useWorkoutData } from "@/contexts/WorkoutDataContext";
import { handleSaveWorkout } from "@/server-actions/WorkoutServerActions";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { TrackingType } from "@prisma/client";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ExerciseTable from "./ExerciseTable";
import StatusBar from "./StatusBar";

interface Exercise {
  id: string;
  name: string;
}

interface WorkoutPlanExercise {
  Exercise: Exercise;
  sets: number;
  reps: number | null;
  exerciseDuration: number | null;
  trackingType: string;
  order: number | null;
}

interface Workout {
  id: string;
  name: string;
  notes: string | null;
  WorkoutPlanExercise: WorkoutPlanExercise[];
}

export default function WorkoutManager({ workout }: { workout: Workout }) {
  const router = useRouter();
  const workoutPlanId = workout.id;
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { startConfetti } = useConfetti();
  const { workoutExercises, setWorkoutExercises } = useWorkoutData();
  const {
    setIsSaving,
    workoutDuration,
    setWorkoutDuration,
    workoutStartTime,
    setWorkoutStartTime,
    activeWorkoutRoutine,
    setActiveWorkoutRoutine,
    startWorkout,
    isPaused,
    togglePause,
  } = useWorkoutControls();

  useEffect(() => {
    if (!isDataLoaded && !activeWorkoutRoutine && workout) {
      const initialWorkoutExercises = workout.WorkoutPlanExercise.map(
        (exerciseDetail) => ({
          exerciseId: exerciseDetail.Exercise.id,
          exerciseName: exerciseDetail.Exercise.name,
          sets: Array.from({ length: exerciseDetail.sets }, () => ({
            completed: false,
            reps: exerciseDetail.reps || null,
            duration: exerciseDetail.exerciseDuration || null,
            weight: null,
          })),
          trackingType: exerciseDetail.trackingType,
        }),
      );
      setWorkoutExercises(initialWorkoutExercises);
      setIsDataLoaded(true);
    }
  }, [workout, activeWorkoutRoutine, setWorkoutExercises, isDataLoaded]);

  const handleCompleteSet = (
    exerciseIndex: number,
    setIndex: number,
    exerciseName: string,
    isSelected: boolean,
  ) => {
    if (!workoutExercises) {
      toast.error("Workout exercises data is not loaded yet");
      return;
    }

    if (isPaused) {
      toast.error("You cannot complete a set while the workout is paused");
      return;
    }

    const exerciseDetail = workoutExercises[exerciseIndex];
    const set = exerciseDetail.sets[setIndex];

    if (
      set.weight === null ||
      !Number(set.weight) ||
      (exerciseDetail.trackingType === "reps" &&
        (set.reps === null || !Number(set.reps))) ||
      (exerciseDetail.trackingType === "duration" &&
        (set.duration === null || !Number(set.duration)))
    ) {
      toast.error(
        "Please fill in all fields before marking the set as completed",
      );
      return;
    }

    if (!workoutStartTime) {
      startWorkout(workoutPlanId);
    }
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;
      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const setToUpdate = { ...exerciseToUpdate.sets[setIndex] };
      setToUpdate.completed = isSelected;
      exerciseToUpdate.sets[setIndex] = setToUpdate;
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      if (setToUpdate.completed) {
        toast.success(`${exerciseName} Set ${setIndex + 1} completed`);
      } else {
        toast(`${exerciseName} Set ${setIndex + 1} marked as incomplete`);
      }
      return updatedWorkoutExercises;
    });
  };

  const handleWeightChange = (
    exerciseIndex: number,
    setIndex: number,
    newValue: number,
  ) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;

      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const setToUpdate = { ...exerciseToUpdate.sets[setIndex] };
      setToUpdate.weight = newValue;
      exerciseToUpdate.sets[setIndex] = setToUpdate;
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      return updatedWorkoutExercises;
    });
  };

  const handleRepChange = (
    exerciseIndex: number,
    setIndex: number,
    newValue: number | null,
  ) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;

      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const setToUpdate = { ...exerciseToUpdate.sets[setIndex] };
      setToUpdate.reps = newValue;
      exerciseToUpdate.sets[setIndex] = setToUpdate;
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      return updatedWorkoutExercises;
    });
  };

  const handleDurationChange = (
    exerciseIndex: number,
    setIndex: number,
    newValue: number | null,
  ) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;

      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const setToUpdate = { ...exerciseToUpdate.sets[setIndex] };
      setToUpdate.duration = newValue;
      exerciseToUpdate.sets[setIndex] = setToUpdate;
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      return updatedWorkoutExercises;
    });
  };

  const addSet = (exerciseIndex: number, exerciseName: string) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;
      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const newSet = {
        completed: false,
        reps: workout.WorkoutPlanExercise[exerciseIndex].reps || null,
        duration:
          workout.WorkoutPlanExercise[exerciseIndex].exerciseDuration || null,
        weight: null,
      };
      exerciseToUpdate.sets.push(newSet);
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      toast.success(`Set added to ${exerciseName}`);
      return updatedWorkoutExercises;
    });
  };

  const removeSet = (exerciseIndex: number, exerciseName: string) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;
      const updatedWorkoutExercises = [...prevWorkoutExercises];
      if (
        updatedWorkoutExercises[exerciseIndex].sets.length > 1 &&
        window.confirm(
          `Are you sure you want to delete the last set from ${exerciseName}?`,
        )
      ) {
        const exerciseToUpdate = {
          ...updatedWorkoutExercises[exerciseIndex],
        };
        exerciseToUpdate.sets.pop();
        updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
        toast.success(`Set removed from ${exerciseName}`);
        return updatedWorkoutExercises;
      } else {
        toast.error(
          `Cannot remove. At least one set is required for ${exerciseName}.`,
        );
      }
      return prevWorkoutExercises;
    });
  };

  const cancelWorkout = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel the workout? No data will be saved.",
      )
    ) {
      setWorkoutExercises([]);
      setWorkoutDuration(0);
      setWorkoutStartTime(null);
      setActiveWorkoutRoutine(null);
      toast("Workout cancelled");
      router.push("/workout");
    }
  };

  const completeWorkout = () => {
    if (workoutExercises) {
      const allSetsCompleted = workoutExercises.every((exercise) =>
        exercise.sets.every((set) => set.completed),
      );

      if (!allSetsCompleted) {
        toast.error("Please complete all sets before finishing the workout.");
        return;
      }

      const filteredExercises = workoutExercises
        .filter((exercise) => exercise.sets.some((set) => set.completed))
        .map((exercise) => ({
          ...exercise,
          sets: exercise.sets.filter((set) => set.completed),
        }));

      if (filteredExercises.length === 0) {
        toast.error(
          "You need to complete at least one set to save the workout.",
        );
        return;
      }

      // Pause the workout timer when showing the upload form
      if (!isPaused) {
        pauseWorkout();
      }

      setShowUploadForm(true); // Show the upload form before saving
    } else {
      toast.error("No workout exercises available.");
    }
  };

  const handleUploadCompletion = async () => {
    setIsUploading(true); // Set uploading state to true

    try {
      const exercisesData = workoutExercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        trackingType:
          TrackingType[exercise.trackingType as keyof typeof TrackingType],
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          duration: set.duration,
          completed: set.completed,
        })),
      }));

      const data = {
        name: workout.name,
        date: new Date().toISOString(),
        duration: workoutDuration,
        workoutPlanId: workout.id,
        exercises: exercisesData,
      };

      const response = await handleSaveWorkout(data);

      if (response.success) {
        startConfetti();
        router.push("/dashboard");
        toast.success("Workout saved successfully!");
      } else {
        toast.error("Failed to save workout");
      }
    } catch (error) {
      toast.error("An error occurred while saving the workout");
    } finally {
      setIsUploading(false); // Reset uploading state
      setShowUploadForm(false); // Hide upload form after upload
      setWorkoutExercises([]);
      setWorkoutDuration(0);
      setWorkoutStartTime(null);
      setActiveWorkoutRoutine(null);

      // Resume the workout timer if it was paused
      if (isPaused) {
        resumeWorkout();
      }
    }
  };

  const skipUpload = async () => {
    const exercisesData = workoutExercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      trackingType:
        TrackingType[exercise.trackingType as keyof typeof TrackingType],
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
        duration: set.duration,
        completed: set.completed,
      })),
    }));

    const data = {
      name: workout.name,
      date: new Date().toISOString(),
      duration: workoutDuration,
      workoutPlanId: workout.id,
      exercises: exercisesData,
    };

    try {
      const response = await handleSaveWorkout(data);
      if (response.success) {
        startConfetti();
        router.push("/dashboard");
        toast.success("Workout saved successfully without image");
      } else {
        toast.error("Failed to save workout");
      }
    } catch (error) {
      toast.error("An error occurred while saving the workout");
    } finally {
      setShowUploadForm(false);
      setWorkoutExercises([]);
      setWorkoutDuration(0);
      setWorkoutStartTime(null);
      setActiveWorkoutRoutine(null);

      // Resume the workout timer if it was paused
      if (isPaused) {
        resumeWorkout();
      }
    }
  };

  const pauseWorkout = () => {
    togglePause();
    setPauseStartTime(Date.now());
  };

  const resumeWorkout = () => {
    togglePause();
    if (pauseStartTime) {
      setPausedTime(
        (prevPausedTime) => prevPausedTime + (Date.now() - pauseStartTime),
      );
    }
    setPauseStartTime(null);
  };

  const workoutName = workout.name;

  const totalSets = workoutExercises
    ? workoutExercises.reduce((acc, curr) => acc + curr.sets.length, 0)
    : 0;

  const completedSets = workoutExercises
    ? workoutExercises.reduce(
        (acc, curr) => acc + curr.sets.filter((set) => set.completed).length,
        0,
      )
    : 0;

  const progressPercentage =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="pb-32">
      {showUploadForm && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="wrapper bg-[#f1f1f1] dark:bg-[#18181a] p-6 rounded-lg shadow-lg relative animate-scaleIn ">
            <UploadForm onUploadComplete={handleUploadCompletion} />
            <Button onPress={skipUpload} className="mt-4 !bg-transparent rounded-md px-4 py-[22px] font-[400] text-black dark:text-white border-1 border-zinc-500 dark:border-zinc-800 w-full">
              Skip
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
        {workoutExercises?.map((exercise, index) => (
          <Card shadow="none" className="shadow-md" key={exercise.exerciseId}>
            <CardHeader className="text-lg px-5">
              <div className="flex gap-2 items-center mb-3">
                <ExerciseOrderIndicator position={index} />
                <p className="text-lg font-[600] text-zinc-800 dark:text-white">
                  {exercise.exerciseName}
                </p>
              </div>
            </CardHeader>
            <CardBody className="pb-1 pt-0">
              <ExerciseTable
                exerciseDetail={exercise}
                index={index}
                handleCompleteSet={handleCompleteSet}
                handleWeightChange={handleWeightChange}
                handleRepChange={handleRepChange}
              />
            </CardBody>
            <CardFooter className="gap-2 px-5 bg-default-100">
              <ButtonGroup className="shrink-0">
                <Button
                  size="sm"
                  onPress={() => addSet(index, exercise.exerciseName)}
                >
                  <IconPlus size={16} />
                  Add Set
                </Button>
                <Button
                  size="sm"
                  onPress={() => removeSet(index, exercise.exerciseName)}
                >
                  <IconX size={16} />
                  Remove Set
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
      </div>
      <StatusBar
        completeWorkout={completeWorkout}
        progressPercentage={progressPercentage}
        activeRoutineId={workoutPlanId}
        cancelWorkout={cancelWorkout}
      />
    </div>
  );
}
