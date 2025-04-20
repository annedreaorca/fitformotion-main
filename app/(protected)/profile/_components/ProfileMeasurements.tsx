"use client";
import { useState } from "react";
import { toast } from "sonner";
import { handleUpdateUserMeasurements } from "@/server-actions/UserServerActions";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { IconDeviceFloppy, IconRulerMeasure } from "@tabler/icons-react";
import { Select, SelectItem } from "@nextui-org/select";

interface UserMeasurements {
  weight?: number | null;
  height?: number | null;
  age?: number | null;
  fitnessGoals?: string | null;
  experienceLevel?: string | null;
  weeklySession?: number | null;
  sessionTime?: number | null;
}

const experienceLevels = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Expert", value: "expert" },
];

const fitnessGoalOptions = [
  { label: "Lose Weight", value: "WEIGHT_LOSS" },
  { label: "Gain Weight", value: "WEIGHT_GAIN" },
  { label: "Maintain Weight", value: "WEIGHT_MAINTAIN" }
];

export default function ProfileMeasurements({
  userMeasurements,
}: {
  userMeasurements: UserMeasurements | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [age, setAge] = useState(userMeasurements?.age || "");
  const [height, setHeight] = useState(userMeasurements?.height || "");
  const [weight, setWeight] = useState(userMeasurements?.weight || "");
  const [fitnessGoals, setFitnessGoals] = useState(userMeasurements?.fitnessGoals || "");
  const [experienceLevel, setExperienceLevel] = useState(userMeasurements?.experienceLevel || "");
  const [weeklySession, setWeeklySession] = useState(
    userMeasurements?.weeklySession || 3
  );
  const [sessionTime, setSessionTime] = useState(
    userMeasurements?.sessionTime || 45
  );

  const handleSubmit = async () => {
    setIsLoading(true);

    const data = {
      age: age.toString(),
      height: height.toString(),
      weight: weight.toString(),
      fitnessGoals: fitnessGoals.toString(),
      experienceLevel: experienceLevel.toString(),
      weeklySession: Number(weeklySession),
      sessionTime: Number(sessionTime),
    };

    const response = await handleUpdateUserMeasurements(data);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  return (
    <Card shadow="none" className="shadow-md">
      <CardHeader className="text-xl font-semibold px-5 pb-0 gap-x-3 items-center">
        <IconRulerMeasure className="text-danger" />
        Measurements & Fitness Profile
      </CardHeader>
      <CardBody className="gap-y-3 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="number"
            label="Height (cm)"
            size="sm"
            placeholder="Enter your Height"
            value={height !== null ? height.toString() : ""}
            onChange={(e) => setHeight(e.target.value)}
          />

          <Input
            type="number"
            label="Weight (kg)"
            size="sm"
            placeholder="Enter your Weight"
            value={weight !== null ? weight.toString() : ""}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <Input
          type="number"
          label="Age"
          size="sm"
          placeholder="Enter your Age"
          value={age !== null ? age.toString() : ""}
          onChange={(e) => setAge(e.target.value)}
        />

        <Select
          label="Fitness Goals"
          placeholder="Select your primary fitness goal"
          selectedKeys={fitnessGoals ? [fitnessGoals] : []}
          onSelectionChange={(keys) => setFitnessGoals(Array.from(keys)[0] as string)}
          className="w-full"
        >
          {fitnessGoalOptions.map((goal) => (
            <SelectItem key={goal.value} value={goal.value}>
              {goal.label}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Experience Level"
          placeholder="Select your fitness experience level"
          selectedKeys={experienceLevel ? [experienceLevel] : []}
          onSelectionChange={(keys) => setExperienceLevel(Array.from(keys)[0] as string)}
          className="w-full"
        >
          {experienceLevels.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              {level.label}
            </SelectItem>
          ))}
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="number"
            label="Workout Days per Week"
            size="sm"
            placeholder="Days per week"
            value={weeklySession.toString()}
            onChange={(e) => setWeeklySession(Number(e.target.value))}
            min={1}
            max={7}
          />

          <Input
            type="number"
            label="Minutes per Session"
            size="sm"
            placeholder="Minutes per workout"
            value={sessionTime.toString()}
            onChange={(e) => setSessionTime(Number(e.target.value))}
            min={10}
            max={180}
          />
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Your data is secure with us. We only use your information to enhance
          your user experience and never share it with third parties.
        </p>
      </CardBody>
      <CardFooter className="px-5">
        <Button
          variant="flat"
          onPress={handleSubmit}
          isLoading={isLoading}
          startContent={<IconDeviceFloppy size={20} />}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}