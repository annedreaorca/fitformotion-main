import PageHeading from "@/components/PageHeading/PageHeading";
import { startTour } from "@/components/TourGuide/ExerciseGuide";
import { ExerciseAddToRoutineModalProvider } from "@/contexts/ExerciseAddToRoutineModalContext";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { IconWalk } from "@tabler/icons-react";
import { Suspense } from "react";
import ExerciseFetch from "./_components/ExerciseFetch";
import ExerciseTableSkeleton from "./_components/ExerciseTableSkeleton";
import ExerciseFilters from "./_components/Filters/ExerciseFilters";
import ExerciseAddToRoutineModal from "./_components/Modals/ExerciseAddToRoutineModal";
import ExerciseDetailModal from "./_components/Modals/ExerciseDetailModal/ExerciseDetailModal";

interface UserRoutine {
  name: string;
  id: string;
}

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams?: {
    page?: number;
    perPage?: number;
    search?: string;
    muscle?: string;
    cat?: string;
    level?: string;
    force?: string;
    favs?: string;
    equipmentOwned?: string;
  };
}) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const perPage = Number(searchParams?.perPage) || 10;
  const search = searchParams?.search || "";
  const cat = searchParams?.cat ? searchParams?.cat.split(",") : [];
  const muscle = searchParams?.muscle ? searchParams?.muscle.split(",") : [];
  const level = searchParams?.level ? searchParams?.level.split(",") : [];
  const force = searchParams?.force ? searchParams?.force.split(",") : [];
  const currentPage = Number(searchParams?.page) || 1;
  const favs = searchParams?.favs === "true";
  const equipmentOwned = searchParams?.equipmentOwned === "true";

  const userRoutines: (UserRoutine & { exerciseCount: number })[] =
    await prisma.workoutPlan
      .findMany({
        where: {
          userId: userId,
        },
        select: {
          name: true,
          id: true,
          WorkoutPlanExercise: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      .then((routines) =>
        routines.map((routine) => ({
          ...routine,
          exerciseCount: routine.WorkoutPlanExercise.length,
        })),
      );

  return (
    <div className="page-container">
      <ExerciseAddToRoutineModalProvider>
        <div className="flex items-center justify-between mb-6" id="exercises-heading">
          <PageHeading title="Exercises" />
          <div className="flex gap-[10px] items-center" id="tour-button">
            <button
              onClick={startTour}
              className="p-[5px] bg-zinc-800 text-white rounded-full hover:bg-zinc-700 w-10 h-10 flex items-center justify-center"
            >
              <IconWalk size={22} />
            </button>
          </div>
        </div>
        
        <div id="filters-container">
          <ExerciseFilters searchParams={searchParams} />
        </div>

        <div id="exercise-table">
          <Suspense
            key={search + cat + muscle + level + force + currentPage}
            fallback={<ExerciseTableSkeleton />}
          >
            <ExerciseFetch
              search={search}
              cat={cat}
              muscle={muscle}
              level={level}
              force={force}
              currentPage={currentPage}
              userRoutines={userRoutines}
              favs={favs}
              equipmentOwned={equipmentOwned}
              mode="exercisePage"
              perPage={perPage}
            />
          </Suspense>
        </div>

        <ExerciseDetailModal />
        <ExerciseAddToRoutineModal />
      </ExerciseAddToRoutineModalProvider>
    </div>
  );
}
