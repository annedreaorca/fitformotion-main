"use client";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { IconSquareCheck } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Set {
  weight: number | "" | null;
  reps?: number | "" | null;
  completed: boolean;
}

interface ExerciseDetail {
  exerciseName: string;
  sets: Set[];
  instructions?: string[];
}

interface ExerciseTableProps {
  exerciseDetail: ExerciseDetail;
  index: number;
  handleCompleteSet: (
    exerciseIndex: number,
    setIndex: number,
    exerciseName: string,
    isSelected: boolean
  ) => void;
  handleWeightChange: (
    exerciseIndex: number,
    setIndex: number,
    newValue: number
  ) => void;
  handleRepChange: (
    exerciseIndex: number,
    setIndex: number,
    newValue: number | null
  ) => void;
}

function formatExerciseNameForImage(exerciseName?: string): string {
  if (!exerciseName) return ""; // Return an empty string if exerciseName is undefined
  return exerciseName.replace(/[^\w\(\)]/g, "_"); // Replace non-word characters with underscores
}

export default function ExerciseTable({
  exerciseDetail,
  index,
  handleCompleteSet,
  handleWeightChange,
  handleRepChange,
}: ExerciseTableProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  // Effect to log instructions for debugging
  useEffect(() => {
    console.log("Instructions: ", exerciseDetail.instructions);
  }, [exerciseDetail.instructions]);

  return (
    <div>
      <div className="flex items-center">
        {/* <h2 className="text-xl font-semibold">{exerciseDetail.exerciseName}</h2> */}
        {/* <IconInfoCircle
          className="hover:text-primary ml-2 cursor-pointer"
          size={24}
          onClick={() => setShowInstructions((prev) => !prev)}
        /> */}
      </div>

      <Table
        removeWrapper
        aria-label={`Table for exercise ${exerciseDetail.exerciseName}`}
        className="min-w-full table-auto"
        shadow="none"
      >
        <TableHeader>
          <TableColumn>SET</TableColumn>
          <TableColumn>WEIGHT</TableColumn>
          <TableColumn>REPETITIONS</TableColumn>
          <TableColumn className="flex justify-center items-center">
            <IconSquareCheck />
          </TableColumn>
        </TableHeader>
        <TableBody>
          {exerciseDetail.sets.map((set, setIndex) => (
            <TableRow key={setIndex}>
              <TableCell>{setIndex + 1}</TableCell>
              <TableCell className="lbs-cont">
                <Input
                  size="sm"
                  type="number"
                  placeholder="0"
                  defaultValue={set.weight !== null ? String(set.weight) : ""}
                  className="lbs-input"
                  endContent={
                    <span className="text-zinc-600 dark:text-default-400 max-[480px]:!px-[1px]">
                      lbs
                    </span>
                  }
                  onInput={(e) => {
                    const value = e.currentTarget.value;
                    if (!/^(\d*\.?\d{0,2}|\.\d{0,2})$/.test(value)) {
                      e.currentTarget.value = value.slice(0, -1);
                    }
                  }}
                  onChange={(e) =>
                    handleWeightChange(index, setIndex, Number(e.target.value))
                  }
                  isDisabled={set.completed}
                />
              </TableCell>
              <TableCell>
                <Input
                  size="sm"
                  className="rep-input"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-zinc-600 dark:text-default-400 text-small">
                        reps
                      </span>
                    </div>
                  }
                  type="number"
                  placeholder="0"
                  defaultValue={set.reps !== null ? String(set.reps) : ""}
                  onInput={(e) => {
                    const value = e.currentTarget.value;
                    if (!/^\d*$/.test(value)) {
                      e.currentTarget.value = value.slice(0, -1);
                    }
                  }}
                  onChange={(e) =>
                    handleRepChange(index, setIndex, Number(e.currentTarget.value))
                  }
                  isDisabled={set.completed}
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  size="lg"
                  color={set.completed ? "primary" : "danger"}
                  isSelected={set.completed}
                  isDisabled={set.completed}
                  aria-label="Complete Set"
                  onValueChange={(isSelected) =>
                    handleCompleteSet(
                      index,
                      setIndex,
                      exerciseDetail.exerciseName,
                      isSelected
                    )
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Instructions Popup */}
      {showInstructions && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div
            className="bg-white p-4 border border-gray-300 rounded shadow-md"
            onClick={() => setShowInstructions(false)} // Close on click outside
          >
            <Image
              src={`/images/exercises/${formatExerciseNameForImage(
                exerciseDetail.exerciseName
              )}/images/0.gif`}
              width={750}
              height={500}
              alt={`${exerciseDetail.exerciseName} gif`}
            />

            {/* Render Instructions if Available */}
            {exerciseDetail?.instructions && exerciseDetail.instructions.length > 0 ? (
              <>
                <h4 className="font-semibold text-lg mb-3">Instructions</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {exerciseDetail.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </>
            ) : (
              <p>No instructions available.</p> // Fallback message if no instructions are provided
            )}

            <Button onClick={() => setShowInstructions(false)} className="mt-2">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
