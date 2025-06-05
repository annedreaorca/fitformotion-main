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
  exerciseId: string; // Add exerciseId to fetch instructions
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
    isSelected: boolean,
  ) => void;
  handleWeightChange: (
    exerciseIndex: number,
    setIndex: number,
    newValue: number,
  ) => void;
  handleRepChange: (
    exerciseIndex: number,
    setIndex: number,
    newValue: number | null,
  ) => void;
  showInstructions?: boolean; // New prop to control instructions visibility
  onCloseInstructions?: () => void; // New prop to handle closing instructions
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
  showInstructions = false,
  onCloseInstructions,
}: ExerciseTableProps) {
  const [instructions, setInstructions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch instructions when needed
  const fetchInstructions = async () => {
    if (!exerciseDetail.exerciseId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/exercises/${exerciseDetail.exerciseId}/instructions`,
      );
      if (response.ok) {
        const data = await response.json();
        setInstructions(data.instructions || []);
      } else {
        console.error("Failed to fetch instructions");
      }
    } catch (error) {
      console.error("Error fetching instructions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch instructions when the modal is opened
  useEffect(() => {
    if (showInstructions && instructions.length === 0) {
      fetchInstructions();
    }
  }, [showInstructions, exerciseDetail.exerciseId]);

  return (
    <div>
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
                    handleRepChange(
                      index,
                      setIndex,
                      Number(e.currentTarget.value),
                    )
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
                      isSelected,
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
            className="bg-white dark:bg-zinc-800 p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md max-w-xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold dark:text-white">
                {exerciseDetail.exerciseName}
              </h3>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => onCloseInstructions && onCloseInstructions()}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <IconSquareCheck size={24} />
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {/* Image Section */}
              <div className="flex justify-center mb-2">
                <Image
                  src={`/images/exercises/${formatExerciseNameForImage(
                    exerciseDetail.exerciseName,
                  )}/images/0.gif`}
                  width={300}
                  height={200}
                  alt={`${exerciseDetail.exerciseName} demonstration`}
                  className="rounded-lg"
                />
              </div>

              {/* Instructions Section */}
              {isLoading ? (
                <div className="text-center py-4">Loading instructions...</div>
              ) : (
                <>
                  <div>
                    <h4 className="font-semibold text-lg mb-3 dark:text-white">
                      Instructions
                    </h4>
                    {instructions && instructions.length > 0 ? (
                      <ol className="list-decimal list-inside space-y-2 text-sm dark:text-gray-300">
                        {instructions.map((instruction, index) => (
                          <li key={index} className="mb-2">
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        No instructions available.
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button
                onClick={() => onCloseInstructions && onCloseInstructions()}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
