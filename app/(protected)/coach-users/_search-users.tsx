"use client";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { IconEraser, IconFilter } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <div className="w-full">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get("search") as string;
          
          if (queryTerm.trim()) {
            router.push(pathname + "?search=" + encodeURIComponent(queryTerm.trim()));
          } else {
            // Clear search - show all users
            router.push(pathname);
          }
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            label="Filter Members"
            placeholder="Enter name to filter members"
            id="search"
            name="search"
            type="text"
            className="flex-3"
          />
          <div className="flex gap-2">
            <Button type="submit" className="w-auto h-15 self-stretch p-3 sm:p-0">
              <IconFilter/>
            </Button>
            <Button 
              type="button" 
              variant="bordered"
              className="w-auto h-15 self-stretch p-0"
              onClick={() => router.push(pathname)}
            >
              <IconEraser/>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};