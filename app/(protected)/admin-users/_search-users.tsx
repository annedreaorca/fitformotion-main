"use client";

import { usePathname, useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="mb-5">
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
        <div className="flex gap-3">
          <Input
            label="Filter Users"
            placeholder="Enter name to filter users"
            id="search"
            name="search"
            type="text"
            className="flex-1"
          />
          <Button type="submit" className="self-end">
            Filter
          </Button>
          <Button 
            type="button" 
            variant="bordered"
            className="self-end"
            onClick={() => router.push(pathname)}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
};