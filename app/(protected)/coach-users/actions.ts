// app/(protected)/coach-users/actions.ts
"use server";

import prisma from "@/prisma/prisma";
import { subDays } from "date-fns";

export interface UserAnalytics {
  weeklyWorkouts: number;
  currentWeight: string;
  weightDate: string;
  averageDuration: number;
  topMuscle: string;
}

export interface RecentActivity {
  id: string;
  duration: number;
  createdAt: Date;
  WorkoutPlan: {
    name: string;
  };
  exercises: {
    id: string;
    Exercise: {
      name: string;
    };
    sets: {
      weight: number | null;
      reps: number | null;
      exerciseDuration: number | null;
    }[];
  }[];
}

export async function getUserAnalytics(userId: string): Promise<UserAnalytics> {
  try {
    // Weekly Workouts (last 7 days)
    const oneWeekAgo = subDays(new Date(), 7);
    const weeklyWorkouts = await prisma.workoutLog.count({
      where: {
        userId: userId,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    // Current Weight
    const latestWeight = await prisma.userWeight.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        recordedAt: "desc",
      },
      select: {
        weight: true,
        recordedAt: true,
      },
    });

    const userInfo = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
      select: {
        weight: true,
      },
    });

    const defaultWeight = userInfo?.weight || "No weight data";
    const currentWeight = latestWeight?.weight 
      ? `${latestWeight.weight} kg` 
      : `${defaultWeight} kg`;
    
    const weightDate = latestWeight?.recordedAt 
      ? new Date(latestWeight.recordedAt).toLocaleDateString() 
      : "No recent data";

    // Average Workout Duration (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const workouts = await prisma.workoutLog.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        duration: true,
      },
    });

    const totalDuration = workouts.reduce((total, workout) => {
      const durationInMinutes = workout.duration >= 60 ? workout.duration / 60 : workout.duration;
      return total + durationInMinutes;
    }, 0);
    
    const averageDuration = workouts.length > 0 ? Math.round(totalDuration / workouts.length) : 0;

    // Top Muscle Group (last 30 days)
    const workoutLogs = await prisma.workoutLog.findMany({
      where: {
        userId: userId,
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        exercises: {
          select: {
            exerciseId: true,
          },
        },
      },
    });

    let topMuscle = "No data yet";

    if (workoutLogs.length > 0) {
      const exerciseIds = workoutLogs.flatMap(log => 
        log.exercises.map(exercise => exercise.exerciseId)
      );

      const exercises = await prisma.exercise.findMany({
        where: {
          id: {
            in: exerciseIds,
          },
        },
        select: {
          primary_muscles: true,
          secondary_muscles: true,
        },
      });

      const muscleCounts: Record<string, number> = {};
      
      exercises.forEach(exercise => {
        exercise.primary_muscles.forEach(muscle => {
          muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 2;
        });
        
        exercise.secondary_muscles.forEach(muscle => {
          muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1;
        });
      });

      let topCount = 0;
      Object.entries(muscleCounts).forEach(([muscle, count]) => {
        if (count > topCount) {
          topMuscle = muscle;
          topCount = count;
        }
      });

      if (topMuscle !== "No data yet") {
        const displayMuscle = topMuscle.replace(/_/g, ' ');
        topMuscle = displayMuscle.charAt(0).toUpperCase() + displayMuscle.slice(1);
      }
    }

    return {
      weeklyWorkouts,
      currentWeight,
      weightDate,
      averageDuration,
      topMuscle,
    };

  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return {
      weeklyWorkouts: 0,
      currentWeight: "Error loading",
      weightDate: "Error loading",
      averageDuration: 0,
      topMuscle: "Error loading",
    };
  }
}

export async function getUserRecentActivity(userId: string, limit: number = 3): Promise<RecentActivity[]> {
  try {
    const recentActivity = await prisma.workoutLog.findMany({
      where: {
        userId: userId,
        inProgress: false,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        duration: true,
        createdAt: true,
        WorkoutPlan: {
          select: {
            name: true,
          },
        },
        exercises: {
          select: {
            id: true,
            Exercise: {
              select: {
                name: true,
              },
            },
            sets: {
              select: {
                weight: true,
                reps: true,
                exerciseDuration: true,
              },
            },
          },
        },
      },
    });

    return recentActivity;
  } catch (error) {
    console.error("Error fetching user recent activity:", error);
    return [];
  }
}