// C:\Users\anned\Desktop\fitformotion\app\(protected)\profile\_components\ProfileActions.tsx

"use client";
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@nextui-org/button";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function ProfileActions() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
      <Button variant="flat" onClick={() => signOut(() => router.push("/"))} className=" text-left justify-start w-full p-[8px] gap-[12px] text-[16px]">
        <IconLogout /> Sign out
      </Button>
  );
}
