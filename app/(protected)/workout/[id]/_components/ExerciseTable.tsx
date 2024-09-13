import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Input } from "@nextui-org/input";
import { IconSquareCheck } from "@tabler/icons-react";
import { Checkbox } from "@nextui-org/checkbox";
import { useState } from "react";

interface Set {
  weight: number | "" | null;
  duration?: number | "" | null;
  reps?: number | "" | null;
  completed: boolean;
}

interface ExerciseDetail {
  exerciseName: string;
  sets: Set[];
  trackingType: string;
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
  handleDurationChange: (
    exerciseIndex: number,
    setIndex: number,
    newValue: number | null,
  ) => void;
}

export default function ExerciseTable({
  exerciseDetail,
  index,
  handleWeightChange,
  handleCompleteSet,
  handleRepChange,
  handleDurationChange,
}: ExerciseTableProps) {
  // Initialize state with kilograms as the default unit
  const [weightInputs, setWeightInputs] = useState<{ [key: number]: string }>({});
  const [weightUnit, setWeightUnit] = useState<{ [key: number]: string }>({});

  return (
    <Table
      removeWrapper
      aria-label={`Table for exercise ${exerciseDetail.exerciseName}`}
      className="min-w-full table-auto"
      shadow="none"
    >
      <TableHeader>
        <TableColumn>SET</TableColumn>
        <TableColumn>WEIGHT</TableColumn>
        {exerciseDetail.trackingType === "duration" ? (
          <TableColumn>DURATION</TableColumn>
        ) : (
          <TableColumn>REPS</TableColumn>
        )}
        <TableColumn className="flex justify-center items-center">
          <IconSquareCheck />
        </TableColumn>
      </TableHeader>
      <TableBody>
        {exerciseDetail.sets.map((set, setIndex) => (
          <TableRow key={setIndex}>
            <TableCell>{setIndex + 1}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Input
                  size="sm"
                  type="number"
                  label={
                    weightUnit[setIndex] === "lbs"
                      ? "Pounds"
                      : "Kilograms"
                  }
                  placeholder="0"
                  value={
                    weightInputs[setIndex] !== undefined
                      ? weightInputs[setIndex]
                      : weightUnit[setIndex] === "kg"
                      ? set.weight !== null ? String(set.weight) : ""
                      : set.weight
                      ? String((set.weight * 2.20462).toFixed(2)) // Show converted value for lbs
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setWeightInputs((prev) => ({
                      ...prev,
                      [setIndex]: value, // Update raw input value
                    }));
                  }}
                  onBlur={() => {
                    const rawValue = parseFloat(weightInputs[setIndex] || "0");
                    const newWeight =
                      weightUnit[setIndex] === "kg"
                        ? rawValue
                        : parseFloat((rawValue / 2.20462).toFixed(2)); // Convert lbs to kg on blur
                    handleWeightChange(index, setIndex, newWeight);
                  }}
                  isDisabled={set.completed}
                />
                <select
                  value={weightUnit[setIndex] || "kg"} // Default to kg
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const rawValue = parseFloat(weightInputs[setIndex] || "0");

                    // Convert when unit changes
                    const convertedWeight =
                      newUnit === "kg"
                        ? parseFloat((rawValue / 2.20462).toFixed(2)) // Convert lbs to kg
                        : parseFloat((rawValue * 2.20462).toFixed(2)); // Convert kg to lbs

                    setWeightUnit((prev) => ({
                      ...prev,
                      [setIndex]: newUnit,
                    }));

                    // Update the input to reflect the converted value
                    setWeightInputs((prev) => ({
                      ...prev,
                      [setIndex]: String(convertedWeight),
                    }));
                  }}
                  className="ml-2"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </TableCell>
            {exerciseDetail.trackingType === "duration" ? (
              <TableCell>
                <Input
                  size="sm"
                  type="number"
                  label="Duration"
                  defaultValue={
                    set.duration !== null ? String(set.duration) : ""
                  }
                  placeholder="0"
                  endContent={
                    <span className="text-zinc-600 dark:text-zinc-400">s</span>
                  }
                  onChange={(e) =>
                    handleDurationChange(
                      index,
                      setIndex,
                      Number(e.currentTarget.value),
                    )
                  }
                  isDisabled={set.completed}
                />
              </TableCell>
            ) : (
              <TableCell>
                <Input
                  size="sm"
                  label="Rep Count"
                  type="number"
                  placeholder="0"
                  defaultValue={set.reps !== null ? String(set.reps) : ""}
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
            )}

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
  );
}