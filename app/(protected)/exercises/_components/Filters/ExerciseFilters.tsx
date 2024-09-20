"use client"; // Add this line to mark the component as a Client Component
import { Button } from "@nextui-org/button";
import { IconFilter, IconFilterOff } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ExerciseFilterLevel from "./ExerciseFilterDifficulty";
import ExerciseFilterMuscle from "./ExerciseFilterMuscle";
import ExerciseFilterPerPage from "./ExerciseFilterPerPage";
import ExerciseSearch from "./ExerciseSearch";
import ExerciseUserFilters from "./ExerciseUserFilters";

export default function ExerciseFilters({
  searchParams,
}: {
  searchParams?: {
    id?: string;
    page?: number;
    search?: string;
    muscle?: string;
    cat?: string;
    level?: string;
    force?: string;
    favs?: string;
    perPage?: number;
  };
}) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { page, search, id, perPage, ...otherParams } = searchParams || {};
  const hasSearchParams = Object.values(otherParams).some((param) => param);
  const [showFilters, setShowFilters] = useState(hasSearchParams);

  const toggleFilters = () => {
    if (showFilters && hasSearchParams) {
      const params = new URLSearchParams();
      if (search) {
        params.set("search", search);
      }
      if (id) {
        params.set("id", id);
      }
      if (perPage) {
        params.set("perPage", perPage.toString());
      }
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    setShowFilters(!showFilters);
  };

  return (
    <div className="mb-3">
      <div className="flex gap-3 mb-3">
        <ExerciseSearch />
        <ExerciseFilterPerPage />
        <div className="relative group"> {/* Add relative positioning for the tooltip */}
          <Button
            isIconOnly
            size="lg"
            variant="flat"
            onClick={toggleFilters}
            aria-label="Toggle Filters"
          >
            {showFilters ? <IconFilterOff /> : <IconFilter />}
          </Button>
          <div className="tooltip-text">Toggle Filters</div> {/* Tooltip text */}
        </div>
      </div>
      {showFilters && (
        <div className="grid grid-cols-2 mb-3 gap-[10px]">
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <ExerciseFilterCategory />
            <ExerciseFilterForce />
          </div> */}
          <ExerciseFilterMuscle />
          <ExerciseFilterLevel />
        </div>
      )}
      <ExerciseUserFilters />
    </div>
  );
}