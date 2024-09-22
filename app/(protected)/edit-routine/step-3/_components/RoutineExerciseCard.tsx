"use client";
import { ChangeEvent } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button, ButtonGroup } from "@nextui-org/button";
import { IconArrowUp, IconArrowDown, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { WorkoutPlanExercise } from "../NewRoutineTypes";
import ExerciseOrderIndicator from "@/components/Generic/ExerciseOrderIndicator";

type RoutineExerciseCardProps = {
  exercise: any;
  index: number;
  totalExercises: number;
  updateExercise: (
    index: number,
    field: keyof WorkoutPlanExercise,
    value: string | number | null,
  ) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  deleteExercise: (index: number) => void;
};

export default function RoutineExerciseCard({
  exercise,
  index,
  totalExercises,
  updateExercise,
  moveUp,
  moveDown,
  deleteExercise,
}: RoutineExerciseCardProps) {
  const router = useRouter();

  const updateTrackingType = (index: number, type: "reps") => {
    updateExercise(index, "trackingType", type);
  };
  
  return (
    <Card key={index} shadow="none" className="touch-none shadow-md">
      <CardBody className="p-3">
        <div className="flex gap-2 items-center mb-3">
          <ExerciseOrderIndicator position={index} />
          <p className="text-lg">{exercise.Exercise.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 mb-3">
          <Input
            size="sm"
            type="number"
            label="Sets"
            min="0"
            value={exercise.sets !== null ? exercise.sets.toString() : ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              const intValue = parseInt(value, 10);
              if (!isNaN(intValue)) {
                updateExercise(index, "sets", intValue);
              } else if (value === "") {
                updateExercise(index, "sets", null);
              }
            }}
          />

          <Input
            size="sm"
            label="Reps"
            type="number"
            min="0"
            value={exercise.reps !== null ? exercise.reps.toString() : ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              const intValue = parseInt(value, 10);
              if (!isNaN(intValue)) {
                updateExercise(index, "reps", intValue);
              } else if (value === "") {
                updateExercise(index, "reps", null);
              }
            }}
          />
        </div>

        <div className="flex justify-between">
          <ButtonGroup size="sm">
            <Button
              aria-label="Move up"
              isIconOnly
              onPress={() => moveUp(index)}
              isDisabled={index === 0}
            >
              <IconArrowUp size={18} />
            </Button>
            <Button
              aria-label="Move down"
              isIconOnly
              onPress={() => moveDown(index)}
              isDisabled={index === totalExercises - 1}
            >
              <IconArrowDown size={18} />
            </Button>
          </ButtonGroup>
          <Button
            aria-label="Delete exercise"
            color="danger"
            isIconOnly
            size="sm"
            onPress={() => deleteExercise(index)}
          >
            <IconTrash size={18} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
