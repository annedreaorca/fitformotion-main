import { auth } from "@clerk/nextjs";
import { Progress } from "@nextui-org/progress";
import prisma from "@/prisma/prisma";
import { IconTrendingUp, IconCalendarStats, IconClock } from "@tabler/icons-react";
import { format, subDays } from "date-fns";
import { Suspense } from "react";

async function BeginnerWeeklyProgress() {
    const { userId } = auth();
    
    if (!userId) {
      throw new Error("You must be signed in to view this page.");
    }
  
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
        {/* Weekly Workout Frequency */}
        <div className="mb-4">
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
          
          {/* Render a calendar visualization based on target workouts instead of fixed days */}
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
        <div className="mb-4">
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
          <div>
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
            
            {/* Personalized feedback based on fitness goals */}
            <div className="mt-2 text-xs text-gray-500">
              {weightLogs.length >= 1 ? (
                fitnessGoal === "WEIGHT_LOSS" ? (
                  <span>
                    {weightDiff < 0 
                      ? `You've lost ${Math.abs(weightDiff).toFixed(1)} kg so far. Keep it up!` 
                      : `Focus on your diet and workouts to start seeing results.`}
                  </span>
                ) : fitnessGoal === "WEIGHT_GAIN" ? (
                  <span>
                    {weightDiff > 0 
                      ? `You've gained ${weightDiff.toFixed(1)} kg so far. Good progress!` 
                      : `Focus on your nutrition and strength training to see gains.`}
                  </span>
                ) : (
                  <span>
                    {Math.abs(weightDiff) < 1 
                      ? `You're maintaining within ${Math.abs(weightDiff).toFixed(1)} kg. Good job!` 
                      : `Your weight has changed by ${Math.abs(weightDiff).toFixed(1)} kg. Adjusting...`}
                  </span>
                )
              ) : (
                <span>Record your weight regularly to track progress toward your goals.</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

export default function DashboardBeginnerCharts() {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Your Progress</h2>
      </div>
      <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading progress...</div>}>
        <BeginnerWeeklyProgress />
      </Suspense>
    </div>
  );
}