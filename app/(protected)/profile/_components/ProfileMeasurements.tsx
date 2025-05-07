"use client";
import {
  handleUpdateUserDetails,
  handleUpdateUserEquipment,
  handleUpdateUserMeasurements
} from "@/server-actions/UserServerActions";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { EquipmentType } from "@prisma/client";
import { IconBarbell, IconDeviceFloppy, IconRulerMeasure, IconUser } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface UserMeasurementsProps {
  birthdate?: Date | string | null;
  height?: number | null;
  weight?: number | null;
  fitnessGoals?: string | null;
  experienceLevel?: string | null;
  weeklySession?: number | null;
  sessionTime?: number | null;
}

interface UserDetailsProps {
  username?: string;
  firstName?: string;
  lastName?: string;
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

const equipmentItems = [
  "barbell",
  "cable",
  "dumbbell",
  "ez_curl_bar",
  "machine",
];

const formatText = (text: string): string => {
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function toEquipmentType(items: string[]): EquipmentType[] {
  return items.filter((item): item is EquipmentType =>
    Object.values(EquipmentType).includes(item as EquipmentType),
  );
}

export default function ProfileMeasurements({
  userDetails,
  userMeasurements,
  equipment,
  userId
}: {
  userDetails: UserDetailsProps;
  userMeasurements: UserMeasurementsProps | null;
  equipment: string[];
  userId: string;
}) {
  // Use isPending state from useTransition for showing loading state
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  
  // User details
  const [username, setUsername] = useState(userDetails?.username || "");
  const [firstName, setFirstName] = useState(userDetails?.firstName || "");
  const [lastName, setLastName] = useState(userDetails?.lastName || "");
  
  // Measurements
  const [birthdate, setBirthdate] = useState(
    userMeasurements?.birthdate
      ? new Date(userMeasurements.birthdate).toISOString().split('T')[0]
      : ""
  );
  const [height, setHeight] = useState<string>(
    userMeasurements?.height !== null && userMeasurements?.height !== undefined
      ? userMeasurements.height.toString()
      : ""
  );
  const [weight, setWeight] = useState<string>(
    userMeasurements?.weight !== null && userMeasurements?.weight !== undefined
      ? userMeasurements.weight.toString()
      : ""
  );
  const [fitnessGoals, setFitnessGoals] = useState<string>(
    userMeasurements?.fitnessGoals || ""
  );
  const [experienceLevel, setExperienceLevel] = useState<string>(
    userMeasurements?.experienceLevel || ""
  );
  const [weeklySession, setWeeklySession] = useState<number>(
    userMeasurements?.weeklySession !== null && userMeasurements?.weeklySession !== undefined
      ? userMeasurements.weeklySession
      : 3
  );
  const [sessionTime, setSessionTime] = useState<number>(
    userMeasurements?.sessionTime !== null && userMeasurements?.sessionTime !== undefined
      ? userMeasurements.sessionTime
      : 45
  );
  
  // Equipment
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(equipment || []);
  
  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveAll = async () => {
    setIsLoading(true);
    let hasErrors = false;

    // 1. Update user details
    const detailsData = {
      username: username,
      firstName: firstName,
      lastName: lastName,
    };

    const detailsResponse = await handleUpdateUserDetails(detailsData);
    if (!detailsResponse.success) {
      toast.error("Failed to update user details");
      hasErrors = true;
    }

    // 2. Update measurements
    const measurementsData = {
      birthdate: birthdate || null,
      height: height || null,
      weight: weight || null,
      fitnessGoals: fitnessGoals || null,
      experienceLevel: experienceLevel || null,
      weeklySession: Number(weeklySession),
      sessionTime: Number(sessionTime),
    };

    const measurementsResponse = await handleUpdateUserMeasurements(measurementsData);
    if (!measurementsResponse.success) {
      toast.error("Failed to update measurements");
      hasErrors = true;
    }

    // 3. Update equipment
    const equipmentResponse = await handleUpdateUserEquipment(
      toEquipmentType(selectedEquipment)
    );
    
    if (!equipmentResponse.success) {
      toast.error("Failed to update equipment");
      hasErrors = true;
    }

    setIsLoading(false);
    
    if (!hasErrors) {
      toast.success("Profile updated successfully");
      setShowSuccess(true);
      
      // Use startTransition to update the UI without triggering a full page reload
      startTransition(() => {
        // Use window.location.reload() with a slight delay instead of router.refresh()
        // This will still reload the page, but it's a more controlled approach
        setTimeout(() => {
          // Use location hash to prevent infinite loop by indicating this is a return visit
          window.location.href = window.location.pathname + "?updated=true" + window.location.hash;
        }, 1000);
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 mb-5">
      {/* Success message */}
      {showSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-3" role="alert">
          <p className="font-medium">Profile updated successfully!</p>
        </div>
      )}
      
      {/* User Details Card */}
      <Card shadow="none" className="shadow-md mb-3">
        <CardHeader className="text-xl font-semibold px-5 pb-0 gap-x-3 items-center">
          <IconUser className="text-danger" />
          Details
        </CardHeader>
        <CardBody className="px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              type="text"
              label="Username"
              size="sm"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isRequired
            />

            <Input
              type="text"
              label="First Name"
              size="sm"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <Input
              type="text"
              label="Last Name"
              size="sm"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>
      
      {/* Measurements Card */}
      <Card shadow="none" className="shadow-md mb-3">
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
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />

            <Input
              type="number"
              label="Weight (kg)"
              size="sm"
              placeholder="Enter your Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <Input
            type="date"
            label="Birth Date"
            size="sm"
            placeholder="Enter your birth date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
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
              onChange={(e) => setWeeklySession(Number(e.target.value) || 3)}
              min={1}
              max={7}
            />

            <Input
              type="number"
              label="Minutes per Session"
              size="sm"
              placeholder="Minutes per workout"
              value={sessionTime.toString()}
              onChange={(e) => setSessionTime(Number(e.target.value) || 45)}
              min={10}
              max={180}
            />
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Your data is secure with us. We only use your information to enhance
            your user experience and never share it with third parties.
          </p>
        </CardBody>
      </Card>
      
      {/* Equipment Card */}
      <Card shadow="none" className="shadow-md mb-3">
        <CardHeader className="text-xl font-semibold px-5 pb-0 gap-x-3 items-center">
          <IconBarbell className="text-danger" />
          Equipments
        </CardHeader>
        <CardBody className="px-5">
          <CheckboxGroup
            value={selectedEquipment}
            onChange={(value) => setSelectedEquipment(value as string[])}
            color="primary"
          >
            {equipmentItems.map((item, index) => (
              <Checkbox key={index} value={item}>
                {formatText(item)}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </CardBody>
      </Card>
      
      {/* Save All Button */}
      <div className="flex justify-center">
        <Button
          variant="flat"
          size="lg"
          onPress={handleSaveAll}
          isLoading={isLoading || isPending}
          startContent={<IconDeviceFloppy size={20} />}
          className="px-8"
        >
          Save All Changes
        </Button>
      </div>
    </div>
  );
}