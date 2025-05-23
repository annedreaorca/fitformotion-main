// C:\Users\anned\Desktop\fitformotion\app\(protected)\profile\_components\ProfileDetails.tsx

"use client";
import { handleUpdateUserDetails } from "@/server-actions/UserServerActions";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { IconDeviceFloppy, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfileDetails({
  username,
  firstName,
  lastName,
}: {
  username: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}) {
  const [inputName, setInputName] = useState(username || "");
  const [inputFirstName, setInputFirstName] = useState(firstName || "");
  const [inputLastName, setInputLastName] = useState(lastName || "");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      username: inputName,
      firstName: inputFirstName,
      lastName: inputLastName,
    };

    const response = await handleUpdateUserDetails(data);
    if (response.success) {
      toast.success("User info updated");
    } else {
      toast.error("Failed to update user info");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                isRequired
              />

              <Input
                type="text"
                label="First Name"
                size="sm"
                placeholder="Enter your first name"
                value={inputFirstName}
                onChange={(e) => setInputFirstName(e.target.value)}
              />

              <Input
                type="text"
                label="Last Name"
                size="sm"
                placeholder="Enter your last name"
                value={inputLastName}
                onChange={(e) => setInputLastName(e.target.value)}
              />
            </div>
          </CardBody>
          <CardFooter className="px-5 gap-3 flex justify-start">
            <Button
              type="submit"
              variant="flat"
              startContent={<IconDeviceFloppy size={20} />}
            >
              Save
            </Button>
            <Button
              as={Link}
              href="/profile/advanced"
              variant="flat"
              startContent={<IconSettings size={20} />}
              className="hidden max-md:flex"
            >
              Advanced
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
