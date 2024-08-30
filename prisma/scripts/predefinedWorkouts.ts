interface WorkoutPlanExerciseBase {
  exerciseId: string;
  sets: number;
  order: number;
  trackingType: "reps" | "duration";
}

interface WorkoutPlanExerciseReps extends WorkoutPlanExerciseBase {
  reps: number;
  duration?: never;
}

interface WorkoutPlanExerciseDuration extends WorkoutPlanExerciseBase {
  reps?: never;
  duration: number;
}

type WorkoutPlanExercise =
  | WorkoutPlanExerciseReps
  | WorkoutPlanExerciseDuration;

interface WorkoutPlanInput {
  name: string;
  notes: string;
  systemRoutineCategory: string;
  WorkoutPlanExercises: WorkoutPlanExercise[];
}

export const predefinedWorkouts: WorkoutPlanInput[] = [
  // Strength
  // {
  //   name: "Full-Body Strength Builder",
  //   systemRoutineCategory: "Strength",
  //   notes:
  //     "This workout is designed to target all major muscle groups, providing a solid foundation of strength. Perfect for those looking to improve overall strength and endurance.",
  //   WorkoutPlanExercises: [
  //     {
  //       exerciseId: "47ebbf9e-82ba-48be-b149-afef96895960", // Barbell Squat
  //       sets: 3,
  //       reps: 8,
  //       order: 1,
  //       trackingType: "reps",
  //     },
  //     {
  //       exerciseId: "c3d7de0b-d4f2-4b72-9298-9fb20f987a59", // Barbell Bench Press - Medium Grip
  //       sets: 3,
  //       reps: 8,
  //       order: 2,
  //       trackingType: "reps",
  //     },
  //     {
  //       exerciseId: "83e1548b-7dfc-4e9e-8c2d-fccf7181a545", // Barbell Deadlift
  //       sets: 3,
  //       reps: 8,
  //       order: 3,
  //       trackingType: "reps",
  //     },
  //     {
  //       exerciseId: "efa36c0c-71fc-48d2-9b1d-a010484add72", // Wide-Grip Lat Pulldown
  //       sets: 3,
  //       reps: 8,
  //       order: 4,
  //       trackingType: "reps",
  //     },
  //     {
  //       exerciseId: "0becd8f5-d92f-4fc8-a0c0-b2f2b157c1f0", // Machine Shoulder (Military) Press
  //       sets: 3,
  //       reps: 8,
  //       order: 5,
  //       trackingType: "reps",
  //     },
  //     {
  //       exerciseId: "e6fe0a08-c0f7-47b7-8530-924cee18d697", // Plank
  //       sets: 3,
  //       duration: 30,
  //       order: 6,
  //       trackingType: "duration",
  //     },
  //   ],
  // },
];
