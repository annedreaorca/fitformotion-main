"use client";
import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: {
    completed: boolean;
    reps: number | null;
    duration: number | null;
    weight: number | null;
  }[];
  trackingType: string;
}

interface WorkoutDataContextType {
  workoutExercises: WorkoutExercise[];
  setWorkoutExercises: Dispatch<SetStateAction<WorkoutExercise[]>>;
}

const defaultContextValue: WorkoutDataContextType = {
  workoutExercises: [],
  setWorkoutExercises: () => {},
};


const WorkoutDataContext =
  createContext<WorkoutDataContextType>(defaultContextValue);

  export const WorkoutDataProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  
    return (
      <WorkoutDataContext.Provider
        value={{ workoutExercises, setWorkoutExercises }}
      >
        {children}
      </WorkoutDataContext.Provider>
    );
  };
  
export const useWorkoutData = () => useContext(WorkoutDataContext);
