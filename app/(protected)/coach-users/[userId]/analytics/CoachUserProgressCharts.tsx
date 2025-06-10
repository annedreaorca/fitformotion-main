// app/(protected)/coach-users/[userId]/analytics/CoachUserProgressCharts.tsx
import { Progress } from "@nextui-org/progress";
import prisma from "@/prisma/prisma";
import { IconTrendingUp, IconCalendarStats, IconClock, IconTarget, IconChartBar } from "@tabler/icons-react";
import { format, subDays } from "date-fns";
import { Suspense } from "react";

interface CoachUserProgressChartsProps {
  userId: string;
}

async function UserProgressData({ userId }: { userId: string }) {
  // Get user profile information
  const userInfo = await prisma.userInfo.findUnique({
    where: { userId },
    select: { 
      fitnessGoals: true,
      experienceLevel: true,
      weeklySession: true,
      sessionTime: true,
      weight: true
    },
  });

  // Default values if user hasn't set preferences
  const weeklySessionGoal = userInfo?.weeklySession || 3;
  const sessionTimeGoal = userInfo?.sessionTime || 45;
  const fitnessGoal = userInfo?.fitnessGoals || "WEIGHT_LOSS";
  const experienceLevel = userInfo?.experienceLevel || "beginner";
  const initialProfileWeight = userInfo?.weight || 0;

  // Get today and a week ago for consistent date range
  const today = new Date();
  const oneWeekAgo = subDays(today, 7);
  
  // Get workouts from the past week
  const workouts = await prisma.workoutLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: oneWeekAgo,
      },
    },
    orderBy: {
      date: 'asc',
    },
    include: {
      exercises: true,
    },
  });

  // Count workouts by day
  const dayMap = new Map();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  days.forEach(day => {
    dayMap.set(day, 0);
  });
  
  workouts.forEach(workout => {
    const dayOfWeek = format(new Date(workout.date), 'EEE');
    dayMap.set(dayOfWeek, (dayMap.get(dayOfWeek) || 0) + 1);
  });

  // Calculate workout stats
  const totalWorkouts = workouts.length;
  const workoutProgressPercentage = Math.min(100, (totalWorkouts / weeklySessionGoal) * 100);
  
  // Calculate total workout time in minutes
  const totalWorkoutTime = workouts.reduce((total, workout) => {
    const durationInMinutes = workout.duration >= 60 ? workout.duration / 60 : workout.duration;
    return total + durationInMinutes;
  }, 0);
  
  const totalSessionTimeGoal = weeklySessionGoal * sessionTimeGoal;
  const timeProgressPercentage = Math.min(100, (totalWorkoutTime / totalSessionTimeGoal) * 100);

  // Get user's weight progress
  const weightLogs = await prisma.userWeight.findMany({
    where: {
      userId,
    },
    orderBy: {
      recordedAt: 'asc',
    },
  });

  let weightDiff = 0;
  let startWeight = initialProfileWeight;
  let currentWeight = startWeight;
  let weightGoalMet = false;
  let weightProgressText = "Getting started";
  let weightProgressStatus = "Just started";
  let weightProgressColor = "text-blue-500";

  if (weightLogs.length >= 1) {
    // Update current weight to the most recent log
    currentWeight = weightLogs[weightLogs.length - 1].weight;
    
    if (weightLogs.length >= 2) {
      startWeight = weightLogs[0].weight;
    } else if (initialProfileWeight > 0) {
      startWeight = initialProfileWeight;
    }
    
    // Calculate the difference
    weightDiff = currentWeight - startWeight;
  
    // Determine weight progress status based on fitness goals
    if (fitnessGoal === "WEIGHT_LOSS") {
      if (weightDiff < -1) {
        weightProgressStatus = "Excellent progress";
        weightProgressText = "On track";
        weightGoalMet = true;
        weightProgressColor = "text-green-500";
      } else if (weightDiff < 0) {
        weightProgressStatus = "Making progress";
        weightProgressText = "On track";
        weightGoalMet = true;
        weightProgressColor = "text-green-500";
      } else {
        weightProgressStatus = "Not yet";
        weightProgressText = "Keep working";
        weightGoalMet = false;
        weightProgressColor = "text-amber-500";
      }
    } else if (fitnessGoal === "WEIGHT_GAIN") {
      if (weightDiff > 1) {
        weightProgressStatus = "Excellent progress";
        weightProgressText = "On track";
        weightGoalMet = true;
        weightProgressColor = "text-green-500";
      } else if (weightDiff > 0) {
        weightProgressStatus = "Making progress";
        weightProgressText = "On track";
        weightGoalMet = true;
        weightProgressColor = "text-green-500";
      } else {
        weightProgressStatus = "Not yet";
        weightProgressText = "Keep working";
        weightGoalMet = false;
        weightProgressColor = "text-amber-500";
      }
    } else {
      // For weight maintenance
      if (Math.abs(weightDiff) < 1) {
        weightProgressStatus = "Maintaining well";
        weightProgressText = "Stable";
        weightGoalMet = true;
        weightProgressColor = "text-green-500";
      } else {
        weightProgressStatus = "Fluctuating";
        weightProgressText = "Adjusting";
        weightGoalMet = false;
        weightProgressColor = "text-amber-500";
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* User Goals Overview */}
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <IconTarget className="text-blue-600" size={20} />
          <h3 className="font-medium text-blue-900 dark:text-blue-100">Member&apos;s Goals & Settings</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Goal:</span>
            <p className="text-blue-800 dark:text-blue-200 capitalize">
              {fitnessGoal.replace('_', ' ').toLowerCase()}
            </p>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Level:</span>
            <p className="text-blue-800 dark:text-blue-200 capitalize">{experienceLevel}</p>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Weekly Target:</span>
            <p className="text-blue-800 dark:text-blue-200">{weeklySessionGoal} workouts</p>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Session Target:</span>
            <p className="text-blue-800 dark:text-blue-200">{sessionTimeGoal} minutes</p>
          </div>
        </div>
      </div>

      {/* Weekly Workout Frequency */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <IconCalendarStats className="text-primary" size={20} />
            <h3 className="text-sm font-medium">Weekly Workout Frequency</h3>
          </div>
          <span className="text-sm font-bold">{Math.round(workoutProgressPercentage)}%</span>
        </div>
        <Progress 
          aria-label="Weekly workout progress" 
          value={workoutProgressPercentage} 
          color="primary"
          className="h-2"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{totalWorkouts} completed</span>
          <span>Goal: {weeklySessionGoal} workouts</span>
        </div>
        
        {/* Workout calendar visualization */}
        <div className="mt-4">
          {weeklySessionGoal < 7 ? (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Workouts this week</span>
                <span className="text-xs text-gray-500">{totalWorkouts} of {weeklySessionGoal}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (totalWorkouts / weeklySessionGoal) * 100)}%` }}
                ></div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {workouts.map((workout, index) => (
                  <div key={index} className="bg-primary bg-opacity-20 text-primary rounded-md px-2 py-1 text-xs">
                    {format(new Date(workout.date), 'EEE')}
                  </div>
                ))}
                {totalWorkouts < weeklySessionGoal && (
                  <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-xs text-gray-400">
                    {weeklySessionGoal - totalWorkouts} more
                  </div>
                )}
              </div>
            </div>
          ) : (
            // For users targeting 7 workouts a week, show the traditional day view
            <div className="flex justify-between mt-4">
              {days.map(day => (
                <div key={day} className="flex flex-col items-center">
                  <div className="text-xs text-gray-500">{day}</div>
                  <div className={`w-4 h-4 rounded-full mt-1 ${dayMap.get(day) > 0 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Workout Duration */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <IconClock className="text-primary" size={20} />
            <h3 className="text-sm font-medium">Weekly Workout Time</h3>
          </div>
          <span className="text-sm font-bold">{Math.round(timeProgressPercentage)}%</span>
        </div>
        <Progress 
          aria-label="Weekly workout time" 
          value={timeProgressPercentage} 
          color="primary"
          className="h-2"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{Math.round(totalWorkoutTime)} minutes</span>
          <span>Goal: {totalSessionTimeGoal} minutes</span>
        </div>
      </div>

      {/* Weight Progress - Show if there's at least one weight log or profile weight set */}
      {(weightLogs.length >= 1 || initialProfileWeight > 0) && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <IconTrendingUp className="text-primary" size={20} />
              <h3 className="text-sm font-medium">
                {fitnessGoal === "WEIGHT_LOSS" ? "Weight Loss Progress" : 
                 fitnessGoal === "WEIGHT_GAIN" ? "Weight Gain Progress" : 
                 "Weight Maintenance"}
              </h3>
            </div>
            <span className={`text-sm font-bold ${weightProgressColor}`}>{weightProgressStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            {startWeight > 0 && (
              <>
                <div className="text-sm">
                  <span className="text-gray-500">Start: </span>
                  <span className="font-medium">{startWeight} kg</span>
                </div>
                {weightLogs.length >= 1 && (
                  <div className="flex items-center">
                    <IconTrendingUp 
                      className={weightProgressColor} 
                      size={18} 
                    />
                    <span className={`text-sm font-bold ${weightProgressColor}`}>
                      {weightDiff > 0 ? "+" : ""}{weightDiff.toFixed(1)} kg
                    </span>
                  </div>
                )}
              </>
            )}
            <div className="text-sm">
              <span className="text-gray-500">Current: </span>
              <span className="font-medium">{currentWeight} kg</span>
            </div>
          </div>
          <Progress 
            aria-label="Weight progress" 
            value={weightGoalMet ? 100 : weightLogs.length >= 2 ? 50 : 25} 
            color={weightGoalMet ? "success" : weightLogs.length >= 2 ? "warning" : "primary"}
            className="h-2 mt-2"
          />
          
          {/* Coach-specific feedback */}
          <div className="mt-2 text-xs text-gray-500">
            {weightLogs.length >= 1 ? (
              fitnessGoal === "WEIGHT_LOSS" ? (
                <span>
                  {weightDiff < 0 
                    ? `Member has lost ${Math.abs(weightDiff).toFixed(1)} kg. Excellent progress!` 
                    : `Member may need guidance on diet and workout intensity.`}
                </span>
              ) : fitnessGoal === "WEIGHT_GAIN" ? (
                <span>
                  {weightDiff > 0 
                    ? `Member has gained ${weightDiff.toFixed(1)} kg. Good progress!` 
                    : `Consider reviewing nutrition and strength training program.`}
                </span>
              ) : (
                <span>
                  {Math.abs(weightDiff) < 1 
                    ? `Member is maintaining weight well within ${Math.abs(weightDiff).toFixed(1)} kg.` 
                    : `Weight has fluctuated by ${Math.abs(weightDiff).toFixed(1)} kg. Monitor closely.`}
                </span>
              )
            ) : (
              <span>Encourage member to log weight regularly for better tracking.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

async function UserRecentActivity({ userId }: { userId: string }) {
  // Get recent activity from the actions file logic
  const recentActivity = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      inProgress: false,
    },
    take: 5, // Show more activities for coach view
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      duration: true,
      createdAt: true,
      date: true,
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

  if (recentActivity.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconChartBar className="text-primary" size={20} />
          <h3 className="text-lg font-medium">Recent Activity</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No workout activity found</p>
          <p className="text-sm">Member hasn't completed any workouts yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <IconChartBar className="text-primary" size={20} />
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <span className="text-sm text-gray-500">({recentActivity.length} recent workouts)</span>
      </div>
      
      <div className="space-y-4">
        {recentActivity.map((workout, index) => {
          const durationInMinutes = workout.duration >= 60 ? workout.duration / 60 : workout.duration;
          const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
          const totalExercises = workout.exercises.length;
          
          return (
            <div key={workout.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-sm">
                    {workout.WorkoutPlan?.name || "Custom Workout"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {format(new Date(workout.date), "MMM d, yyyy")} • {format(new Date(workout.createdAt), "h:mm a")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{Math.round(durationInMinutes)} min</div>
                  <div className="text-xs text-gray-500">
                    {totalExercises} exercises • {totalSets} sets
                  </div>
                </div>
              </div>
              
              {/* Exercise Summary */}
              <div className="space-y-2">
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Exercises:</div>
                <div className="flex flex-wrap gap-1">
                  {workout.exercises.slice(0, 4).map((exercise, idx) => (
                    <span 
                      key={exercise.id} 
                      className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                    >
                      {exercise.Exercise.name}
                    </span>
                  ))}
                  {workout.exercises.length > 4 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{workout.exercises.length - 4} more
                    </span>
                  )}
                </div>
              </div>
              
              {/* Performance Highlights */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Total Sets:</span>
                    <div className="font-medium">{totalSets}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Weight:</span>
                    <div className="font-medium">
                      {(() => {
                        const weights = workout.exercises.flatMap(ex => 
                          ex.sets.map(set => set.weight).filter(w => w !== null)
                        );
                        const avgWeight = weights.length > 0 
                          ? weights.reduce((sum, w) => sum + (w || 0), 0) / weights.length 
                          : 0;
                        return avgWeight > 0 ? `${Math.round(avgWeight)} kg` : "N/A";
                      })()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Reps:</span>
                    <div className="font-medium">
                      {workout.exercises.reduce((total, ex) => 
                        total + ex.sets.reduce((setTotal, set) => setTotal + (set.reps || 0), 0), 0
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {recentActivity.length >= 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Showing 5 most recent workouts</p>
        </div>
      )}
    </div>
  );
}

export function CoachUserProgressCharts({ userId }: CoachUserProgressChartsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Progress Overview</h2>
        <span className="text-sm text-gray-500">Last 7 days</span>
      </div>
      <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading progress...</div>}>
        <UserProgressData userId={userId} />
      </Suspense>
      
      <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading recent activity...</div>}>
        <UserRecentActivity userId={userId} />
      </Suspense>
    </div>
  );
}