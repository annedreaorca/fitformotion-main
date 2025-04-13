"use client";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { WorkoutLog } from "./ModalChartTypes";
import * as tf from '@tensorflow/tfjs';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MLModel {
  isLoaded: boolean;
  model: tf.LayersModel | null;
  userCoefficients: {
    repMultiplier: number;
    baseAdjustment: number;
    repRangeMultipliers?: {
      low: number;
      medium: number;
      high: number;
    };
  };
  modelVersion: number;
  lastTrainingDate?: string;
  trainingMetrics?: {
    mse: number;
    validationAccuracy: number;
    dataPoints: number;
  };
}

// Define standard weight increments in the gym (in lbs)
const STANDARD_WEIGHT_INCREMENTS = [2.5, 5, 10, 15, 20, 25, 30, 35, 45, 50];

// Round to nearest available weight in the gym
const roundToGymWeight = (weight: number): number => {
  // For simplicity, round to nearest 5lb increment
  // This is common for most gym equipment
  return Math.round(weight / 5) * 5;
};

// Exercise-specific coefficients for more accurate predictions
const exerciseSpecificCoefficients = {
  // Identifiers should match your database exercise IDs
  "bench-press": { repMultiplier: 0.033, baseAdjustment: 1 },
  "squat": { repMultiplier: 0.042, baseAdjustment: 1 },
  "deadlift": { repMultiplier: 0.038, baseAdjustment: 1 },
  default: { repMultiplier: 0.033, baseAdjustment: 1 }
};

export default function RecordsTab({ exerciseId }: { exerciseId: string | undefined }) {
  const [model, setModel] = useState<MLModel>({
    isLoaded: false,
    model: null,
    userCoefficients: { repMultiplier: 1/30, baseAdjustment: 1 },
    modelVersion: 1
  });
  const [modelLoading, setModelLoading] = useState(true);
  const [exerciseSpecificData, setExerciseSpecificData] = useState<any>(null);
  const [performanceImprovement, setPerformanceImprovement] = useState<number | null>(null);

  // Fetch workout history data
  const { data, error } = useSWR<WorkoutLog[]>(`/api/exercise-history/${exerciseId}`, fetcher);
  
  // Fetch exercise-specific optimization data
  const { data: optimizationData } = useSWR(
    exerciseId ? `/api/exercise-optimization/${exerciseId}` : null,
    fetcher
  );

  useEffect(() => {
    if (optimizationData) {
      setExerciseSpecificData(optimizationData);
    }
  }, [optimizationData]);
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        // If we have historical data, use it to adjust coefficients
        if (data && data.length > 0) {
          // Extract key exercise type (e.g. "bench-press", "squat", "deadlift")
          const exerciseType = extractExerciseType(exerciseId);
          
          // Create a feature set from historical data
          const { features, advancedMetrics } = extractFeaturesFromWorkouts(data);
          
          // Either load pre-trained model or create a new one
          let tfModel: tf.LayersModel;
          let modelVersion = 1;
          let shouldTrain = false;
          
          try {
            // Try to load a model for this exercise from browser storage if it exists
            const modelStorageKey = `exercise-model-${exerciseId}`;
            tfModel = await tf.loadLayersModel(`indexeddb://${modelStorageKey}`);
            console.log("Loaded existing model");
            
            // Check if model needs retraining (e.g., if we have new data)
            const modelInfo = localStorage.getItem(`model-info-${exerciseId}`);
            if (modelInfo) {
              const { version, lastDataCount } = JSON.parse(modelInfo);
              modelVersion = version;
              
              // If we have 20% more data or it's been 30 days since last training, retrain
              const daysSinceLastTrain = (new Date().getTime() - new Date(JSON.parse(modelInfo).lastTrained).getTime()) / (1000 * 60 * 60 * 24);
              if (features.length > lastDataCount * 1.2 || daysSinceLastTrain > 30) {
                shouldTrain = true;
                modelVersion++;
              }
            }
          } catch (e) {
            // Create a new model if no existing model
            tfModel = createEnhancedModel();
            shouldTrain = features.length >= 5; // Only train if we have enough data points
          }
          
          // Train or retrain model if needed
          let trainingMetrics = undefined;
          
          if (shouldTrain && features.length >= 5) {
            console.log("Training/retraining model with", features.length, "data points");
            trainingMetrics = await trainEnhancedModel(tfModel, features);
            
            // Save model after training
            await tfModel.save(`indexeddb://exercise-model-${exerciseId}`);
            
            // Store model metadata
            localStorage.setItem(`model-info-${exerciseId}`, JSON.stringify({
              version: modelVersion,
              lastDataCount: features.length,
              lastTrained: new Date().toISOString(),
              metrics: trainingMetrics
            }));
          }
          
          // Calculate personalized coefficients with rep range specificity
          const userCoefficients = calculateEnhancedUserCoefficients(data, exerciseType);
          
          // Calculate performance improvement over time if we have enough data
          const recentPerformanceImprovement = calculatePerformanceImprovement(data);
          setPerformanceImprovement(recentPerformanceImprovement);
          
          setModel({
            isLoaded: true,
            model: tfModel,
            userCoefficients,
            modelVersion,
            lastTrainingDate: new Date().toISOString(),
            trainingMetrics
          });
        } else {
          // Without data, we'll just use formula-based predictions with default coefficients
          setModel({
            isLoaded: true,
            model: null,
            userCoefficients: { 
              repMultiplier: 0.033, 
              baseAdjustment: 1,
              repRangeMultipliers: { low: 0.03, medium: 0.033, high: 0.035 }
            },
            modelVersion: 1
          });
        }
      } catch (error) {
        console.error("Failed to load ML model:", error);
        // Fallback to formula-based approach
        setModel({
          isLoaded: true, 
          model: null,
          userCoefficients: { repMultiplier: 0.033, baseAdjustment: 1 },
          modelVersion: 1
        });
      } finally {
        setModelLoading(false);
      }
    };
    
    if (data) {
      loadModel();
    }
  }, [data, exerciseId]);

  // Helper function to extract exercise type from ID
  const extractExerciseType = (id: string | undefined): string => {
    if (!id) return 'default';
    
    // Map exerciseId to exercise types (this is a simple example)
    const exerciseMap: {[key: string]: string} = {
      'bench-press': 'bench-press',
      'incline-bench-press': 'bench-press',
      'decline-bench-press': 'bench-press',
      'squat': 'squat',
      'front-squat': 'squat',
      'hack-squat': 'squat',
      'deadlift': 'deadlift',
      'romanian-deadlift': 'deadlift',
      'sumo-deadlift': 'deadlift'
    };
    
    return exerciseMap[id] || 'default';
  };

  // Enhanced feature extraction with additional metrics
  const extractFeaturesFromWorkouts = (workouts: WorkoutLog[]) => {
    const features: {
      weight: number;
      reps: number;
      date: number; // Days since first workout
      recoveryDays: number;
      volumeIndex: number; // Weekly volume
      oneRM: number;
      repRange: 'low' | 'medium' | 'high';
      fatigue: number; // Estimated fatigue level
    }[] = [];
    
    // Advanced metrics to track
    const advancedMetrics = {
      volumeByWeek: {} as Record<string, number>,
      intensityByWeek: {} as Record<string, number>,
      frequencyByWeek: {} as Record<string, number>,
      weeklyPRs: [] as {week: string, oneRM: number}[]
    };
    
    // Sort workouts by date
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    if (sortedWorkouts.length === 0) return { features, advancedMetrics };
    
    const firstWorkoutDate = new Date(sortedWorkouts[0].date).getTime();
    let lastWorkoutDate = firstWorkoutDate;
    
    // Calculate weekly volumes and create week identifiers
    sortedWorkouts.forEach((workout) => {
      const workoutDate = new Date(workout.date);
      const weekId = `${workoutDate.getFullYear()}-${Math.floor(workoutDate.getTime() / (7 * 24 * 60 * 60 * 1000))}`;
      
      // Initialize week data if not exists
      if (!advancedMetrics.volumeByWeek[weekId]) {
        advancedMetrics.volumeByWeek[weekId] = 0;
        advancedMetrics.intensityByWeek[weekId] = 0;
        advancedMetrics.frequencyByWeek[weekId] = 0;
      }
      
      // Track frequency
      advancedMetrics.frequencyByWeek[weekId]++;
      
      // Calculate workout metrics
      let workoutVolume = 0;
      let maxOneRM = 0;
      
      workout.exercises.forEach(exercise => {
        let exerciseVolume = 0;
        let exerciseIntensity = 0;
        
        exercise.sets.forEach(set => {
          const setVolume = set.weight * set.reps;
          exerciseVolume += setVolume;
          
          const oneRM = calculate1RM(set.weight, set.reps);
          maxOneRM = Math.max(maxOneRM, oneRM);
          
          // Accumulate intensity (average % of 1RM)
          exerciseIntensity += (set.weight / oneRM) * 100;
        });
        
        // Add to weekly volume
        workoutVolume += exerciseVolume;
        
        // Add to weekly intensity (average)
        if (exercise.sets.length > 0) {
          advancedMetrics.intensityByWeek[weekId] += exerciseIntensity / exercise.sets.length;
        }
      });
      
      // Add to weekly metrics
      advancedMetrics.volumeByWeek[weekId] += workoutVolume;
      
      // Record PR if it's a new max
      const existingPRsForWeek = advancedMetrics.weeklyPRs.find(pr => pr.week === weekId);
      if (!existingPRsForWeek || maxOneRM > existingPRsForWeek.oneRM) {
        if (existingPRsForWeek) {
          existingPRsForWeek.oneRM = maxOneRM;
        } else {
          advancedMetrics.weeklyPRs.push({ week: weekId, oneRM: maxOneRM });
        }
      }
    });
    
    // Now create features with enhanced metrics
    let lastWorkoutVolume = 0;
    sortedWorkouts.forEach((workout) => {
      const workoutDate = new Date(workout.date).getTime();
      const daysSinceFirst = Math.floor((workoutDate - firstWorkoutDate) / (1000 * 60 * 60 * 24));
      const recoveryDays = Math.floor((workoutDate - lastWorkoutDate) / (1000 * 60 * 60 * 24));
      
      // Get weekly volume for fatigue estimation
      const weekId = `${new Date(workout.date).getFullYear()}-${Math.floor(workoutDate / (7 * 24 * 60 * 60 * 1000))}`;
      const weeklyVolume = advancedMetrics.volumeByWeek[weekId] || 0;
      
      // Calculate a relative volume index (compared to average weekly volume)
      const avgWeeklyVolume = Object.values(advancedMetrics.volumeByWeek).reduce((sum, vol) => sum + vol, 0) / 
                             Math.max(1, Object.keys(advancedMetrics.volumeByWeek).length);
      const volumeIndex = weeklyVolume / Math.max(1, avgWeeklyVolume);
      
      // Calculate fatigue based on volume and recovery
      const fatigue = Math.min(10, Math.max(1, 
        (volumeIndex * 5) - (recoveryDays * 0.5)
      ));
      
      workout.exercises.forEach(exercise => {
        // Accumulate workout volume for this specific exercise
        let exerciseVolume = 0;
        exercise.sets.forEach(set => {
          exerciseVolume += set.weight * set.reps;
        });
        
        exercise.sets.forEach(set => {
          // Calculate one rep max for this set
          const oneRM = calculate1RM(set.weight, set.reps);
          
          // Determine rep range category
          let repRange: 'low' | 'medium' | 'high';
          if (set.reps <= 5) repRange = 'low';
          else if (set.reps <= 10) repRange = 'medium';
          else repRange = 'high';
          
          features.push({
            weight: set.weight,
            reps: set.reps,
            date: daysSinceFirst,
            recoveryDays: Math.min(recoveryDays, 14), // Cap at 14 days
            volumeIndex: volumeIndex,
            oneRM,
            repRange,
            fatigue
          });
        });
      });
      
      lastWorkoutDate = workoutDate;
      lastWorkoutVolume = weeklyVolume;
    });
    
    return { features, advancedMetrics };
  };

  // Create an enhanced neural network model with additional features
  const createEnhancedModel = () => {
    const model = tf.sequential();
    
    // Input features: [oneRM, targetReps, daysSinceStart, recoveryDays, volumeIndex, fatigue, repRangeEncoded(3)]
    model.add(tf.layers.dense({
      inputShape: [8],
      units: 16,
      activation: 'relu',
      kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
    }));
    
    // Add dropout to prevent overfitting
    model.add(tf.layers.dropout({ rate: 0.2 }));
    
    model.add(tf.layers.dense({
      units: 8,
      activation: 'relu',
      kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
    }));
    
    // Output: predicted weight
    model.add(tf.layers.dense({
      units: 1
    }));
    
    model.compile({
      optimizer: tf.train.adam(0.005),
      loss: 'meanSquaredError',
      metrics: ['mse']
    });
    
    return model;
  };

  // Train the enhanced model with user data
  const trainEnhancedModel = async (model: tf.LayersModel, features: any[]) => {
    if (features.length < 5) return; // Need minimum data points
    
    // Split data into training and validation sets (80/20)
    const shuffledFeatures = [...features].sort(() => Math.random() - 0.5);
    const splitIndex = Math.floor(shuffledFeatures.length * 0.8);
    const trainingFeatures = shuffledFeatures.slice(0, splitIndex);
    const validationFeatures = shuffledFeatures.slice(splitIndex);
    
    // Prepare training data with one-hot encoding for rep range
    const prepareData = (dataPoints: any[]) => {
      const inputData = dataPoints.map(f => [
        f.oneRM, 
        f.reps, 
        f.date / 30, // Normalize days (roughly a month)
        Math.min(f.recoveryDays, 14) / 14, // Cap and normalize recovery
        f.volumeIndex / 2, // Normalize volume index
        f.fatigue / 10, // Normalize fatigue
        // One-hot encoding for rep range
        f.repRange === 'low' ? 1 : 0,
        f.repRange === 'medium' ? 1 : 0,
        f.repRange === 'high' ? 1 : 0
      ]);
      
      const labels = dataPoints.map(f => [f.weight]);
      return { xs: tf.tensor2d(inputData), ys: tf.tensor2d(labels) };
    };
    
    const { xs: trainingXs, ys: trainingYs } = prepareData(trainingFeatures);
    const { xs: validationXs, ys: validationYs } = prepareData(validationFeatures);
    
    // Train the model with early stopping
    const trainResult = await model.fit(trainingXs, trainingYs, {
      epochs: 100,
      batchSize: Math.min(trainingFeatures.length, 32),
      validationData: [validationXs, validationYs],
      callbacks: [
        tf.callbacks.earlyStopping({
          monitor: 'val_loss',
          patience: 10
        })
      ]
    });
    
    // Evaluate on validation set
    const evalResult = model.evaluate(validationXs, validationYs) as tf.Tensor[];
    const validationMSE = evalResult[0].dataSync()[0];
    
    // Clean up tensors
    trainingXs.dispose();
    trainingYs.dispose();
    validationXs.dispose();
    validationYs.dispose();
    evalResult.forEach(tensor => tensor.dispose());
    
    // Return training metrics
    return {
      mse: validationMSE,
      validationAccuracy: Math.sqrt(validationMSE), // RMSE is more interpretable
      dataPoints: features.length,
      epochs: trainResult.epoch.length
    };
  };

  // Calculate enhanced user coefficients including rep range specific multipliers
  const calculateEnhancedUserCoefficients = (workouts: WorkoutLog[], exerciseType: string) => {
    // Extract all sets with their 1RM
    const allSets: { weight: number; reps: number; oneRM: number; repRange: 'low' | 'medium' | 'high' }[] = [];
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          // Use exercise-specific 1RM calculation if available
          const oneRM = calculate1RM(set.weight, set.reps, exerciseType);
          
          // Determine rep range category
          let repRange: 'low' | 'medium' | 'high';
          if (set.reps <= 5) repRange = 'low';
          else if (set.reps <= 10) repRange = 'medium';
          else repRange = 'high';
          
          allSets.push({
            weight: set.weight,
            reps: set.reps,
            oneRM,
            repRange
          });
        });
      });
    });
    
    if (allSets.length < 5) {
      // Not enough data for personalization, use exercise-specific defaults
      const defaults = exerciseSpecificCoefficients[exerciseType as keyof typeof exerciseSpecificCoefficients] || 
                       exerciseSpecificCoefficients.default;
      
      return { 
        ...defaults,
        repRangeMultipliers: {
          low: defaults.repMultiplier * 0.9,
          medium: defaults.repMultiplier,
          high: defaults.repMultiplier * 1.1
        }
      };
    }
    
    // Group sets by rep range for specific coefficient calculation
    const lowRepSets = allSets.filter(set => set.repRange === 'low');
    const mediumRepSets = allSets.filter(set => set.repRange === 'medium');
    const highRepSets = allSets.filter(set => set.repRange === 'high');
    
    // Function to calculate multiplier for a specific rep range
    const calculateMultiplierForRepRange = (sets: typeof allSets) => {
      if (sets.length < 3) {
        // Fall back to exercise-specific default
        return (exerciseSpecificCoefficients[exerciseType as keyof typeof exerciseSpecificCoefficients] || 
                exerciseSpecificCoefficients.default).repMultiplier;
      }
      
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      let n = sets.length;
      
      sets.forEach(set => {
        // Transform the equation to find the multiplier
        const x = set.reps / set.oneRM;
        const y = set.weight / set.oneRM - 1; // We'll add 1 back later
        
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
      });
      
      // Calculate linear regression coefficient
      const multiplier = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      
      // Constrain to reasonable values
      return Math.max(0.01, Math.min(0.1, Math.abs(multiplier)));
    };
    
    // Calculate multipliers for each rep range
    const lowRepMultiplier = calculateMultiplierForRepRange(lowRepSets);
    const mediumRepMultiplier = calculateMultiplierForRepRange(mediumRepSets);
    const highRepMultiplier = calculateMultiplierForRepRange(highRepSets);
    
    // Calculate overall multiplier as weighted average
    const totalSets = allSets.length;
    const overallMultiplier = (
      (lowRepSets.length * lowRepMultiplier) +
      (mediumRepSets.length * mediumRepMultiplier) +
      (highRepSets.length * highRepMultiplier)
    ) / totalSets;
    
    return {
      repMultiplier: overallMultiplier,
      baseAdjustment: 1, // Fixed to match standard formulas
      repRangeMultipliers: {
        low: lowRepMultiplier,
        medium: mediumRepMultiplier,
        high: highRepMultiplier
      }
    };
  };

  // Calculate user's performance improvement over recent weeks
  const calculatePerformanceImprovement = (workouts: WorkoutLog[]): number | null => {
    if (workouts.length < 3) return null; // Need at least 3 workouts for trend
    
    // Sort workouts by date
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Group by month for trend analysis
    const monthlyMaxes: {[month: string]: number} = {};
    
    sortedWorkouts.forEach(workout => {
      const date = new Date(workout.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      let maxOneRM = 0;
      
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          const oneRM = calculate1RM(set.weight, set.reps);
          maxOneRM = Math.max(maxOneRM, oneRM);
        });
      });
      
      // Update monthly maximum
      if (!monthlyMaxes[monthKey] || maxOneRM > monthlyMaxes[monthKey]) {
        monthlyMaxes[monthKey] = maxOneRM;
      }
    });
    
    // Calculate improvement percentage if we have at least 2 months of data
    const months = Object.keys(monthlyMaxes).sort();
    if (months.length < 2) return null;
    
    const firstMonth = monthlyMaxes[months[0]];
    const lastMonth = monthlyMaxes[months[months.length - 1]];
    
    // Return percentage improvement
    return ((lastMonth - firstMonth) / firstMonth) * 100;
  };

  // Function to calculate 1RM using exercise-specific coefficients
  const calculate1RM = (weight: number, reps: number, exerciseType: string = 'default'): number => {
    const { repMultiplier } = 
      exerciseSpecificCoefficients[exerciseType as keyof typeof exerciseSpecificCoefficients] || 
      exerciseSpecificCoefficients.default;
    
    return weight * (1 + reps * repMultiplier);
  };

  // Enhanced prediction function that uses ML model and rep range specific multipliers
  const predictWeightForReps = (oneRM: number, targetReps: number): number | null => {
    if (!model.isLoaded) {
      return null;
    }
    
    // Get today's date for timeline features
    const now = new Date().getTime();
    const firstWorkoutDate = data && data.length > 0 ? 
      new Date(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date).getTime() : 
      now;
    const daysSinceFirst = Math.floor((now - firstWorkoutDate) / (1000 * 60 * 60 * 24));
    
    // Get last workout date for recovery calculation
    const lastWorkoutDate = data && data.length > 0 ?
      new Date(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).getTime() :
      now;
    const recoveryDays = Math.floor((now - lastWorkoutDate) / (1000 * 60 * 60 * 24));
    
    // Determine rep range for targeted prediction
    let repRange: 'low' | 'medium' | 'high';
    if (targetReps <= 5) repRange = 'low';
    else if (targetReps <= 10) repRange = 'medium';
    else repRange = 'high';
    
    try {
      // If we have enough data and a trained model, use it
      if (model.model && data && data.length >= 5) {
        // Get weekly volume average for current prediction
        const recentWorkouts = data.filter(w => {
          const workoutDate = new Date(w.date).getTime();
          return (now - workoutDate) <= 14 * 24 * 60 * 60 * 1000; // Last 2 weeks
        });
        
        // Calculate average volume from recent workouts
        let totalVolume = 0;
        let workoutCount = 0;
        
        recentWorkouts.forEach(workout => {
          let workoutVolume = 0;
          workout.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
              workoutVolume += set.weight * set.reps;
            });
          });
          totalVolume += workoutVolume;
          workoutCount++;
        });
        
        const avgVolume = workoutCount > 0 ? totalVolume / workoutCount : 1000; // Default if no recent workouts
        const volumeIndex = 1; // Normalized to 1 for prediction
        
        // Estimate fatigue based on recovery days
        const fatigue = Math.max(1, 5 - (recoveryDays * 0.5)); // Scale from 1-5 based on recovery
        
        // Prepare input tensor with one-hot encoding for rep range
        const inputTensor = tf.tensor2d([
          [
            oneRM,
            targetReps,
            daysSinceFirst / 30, // Normalize days
            Math.min(recoveryDays, 14) / 14, // Cap and normalize recovery
            volumeIndex / 2, // Normalize volume
            fatigue / 10, // Normalize fatigue
            // One-hot encoding for rep range
            repRange === 'low' ? 1 : 0,
            repRange === 'medium' ? 1 : 0,
            repRange === 'high' ? 1 : 0
          ]
        ]);
        
        // Get prediction
        const prediction = model.model.predict(inputTensor) as tf.Tensor;
        const predictedWeight = prediction.dataSync()[0];
        
        // Clean up tensors
        inputTensor.dispose();
        prediction.dispose();
        
        // Calculate formula-based prediction using rep-range specific multipliers
        let repMultiplier = model.userCoefficients.repMultiplier;
        
        // Use rep range specific multiplier if available
        if (model.userCoefficients.repRangeMultipliers) {
          repMultiplier = model.userCoefficients.repRangeMultipliers[repRange];
        }
        
        const formulaPrediction = oneRM / (model.userCoefficients.baseAdjustment + targetReps * repMultiplier);
        
        // Blend ML prediction with formula-based prediction for stability
        // Use more ML weight if we have more data
        const mlWeight = Math.min(0.7, 0.4 + (data.length / 100) * 0.3);
        const formulaWeight = 1 - mlWeight;
        
        const blendedPrediction = (predictedWeight * mlWeight) + (formulaPrediction * formulaWeight);
        
        // Round to practical gym weight
        return roundToGymWeight(blendedPrediction);
      } else {
        // Use personalized formula-based prediction with rep-range specific multipliers
        let repMultiplier = model.userCoefficients.repMultiplier;
        const { baseAdjustment } = model.userCoefficients;
        
        // Use rep range specific multiplier if available
        if (model.userCoefficients.repRangeMultipliers) {
          repMultiplier = model.userCoefficients.repRangeMultipliers[repRange];
        }
        
      // Apply the formula-based prediction with adjustments
const predictedWeight = oneRM / (baseAdjustment + targetReps * repMultiplier);
        
// Round to practical gym weight
return roundToGymWeight(predictedWeight);
      }
    } catch (error) {
      console.error("Error in weight prediction:", error);
      // Fallback to basic formula
      return roundToGymWeight(oneRM / (1 + targetReps / 30));
    }
  };

  // Process workout history and extract best performances
  const processRecords = (workouts: WorkoutLog[]) => {
    let bestByReps = Array.from({ length: 12 }, () => ({
      weight: 0,
      date: "",
    }));
    let maxVolume = { volume: 0, weight: 0, reps: 0, date: "" };
    let max1RM = 0;
    let exerciseType = extractExerciseType(exerciseId);

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          const { weight, reps } = set;
          const volume = weight * reps;
          const estimated1RM = calculate1RM(weight, reps, exerciseType);

          if (reps <= 12) {
            for (let i = reps - 1; i >= 0; i--) {
              if (weight > bestByReps[i].weight) {
                bestByReps[i] = { weight, date: workout.date };
              }
            }
          }

          if (volume > maxVolume.volume) {
            maxVolume = { volume, weight, reps, date: workout.date };
          }

          max1RM = Math.max(max1RM, estimated1RM);
        });
      });
    });

    return { bestByReps, maxVolume, max1RM };
  };

  // Get optimal rep ranges for progress based on user data
  const getOptimalRepRanges = () => {
    if (!data || data.length < 5) {
      return {
        strength: "1-5 reps",
        hypertrophy: "8-12 reps",
        endurance: "15+ reps",
        recommendation: "Train across all rep ranges for balanced development"
      };
    }

    // Analyze user progress by rep range
    const repRangeProgress: Record<string, { improvement: number, count: number }> = {
      low: { improvement: 0, count: 0 },
      medium: { improvement: 0, count: 0 },
      high: { improvement: 0, count: 0 }
    };
    
    // Create time-based analysis to see progress in each rep range
    const sortedWorkouts = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Create time periods (quarters of available data)
    const timePeriods = 4;
    const workoutsPerPeriod = Math.max(1, Math.floor(sortedWorkouts.length / timePeriods));
    
    for (let period = 0; period < timePeriods - 1; period++) {
      const startPeriodWorkouts = sortedWorkouts.slice(
        period * workoutsPerPeriod, 
        (period + 1) * workoutsPerPeriod
      );
      
      const endPeriodWorkouts = sortedWorkouts.slice(
        (period + 1) * workoutsPerPeriod, 
        (period + 2) * workoutsPerPeriod
      );
      
      if (startPeriodWorkouts.length === 0 || endPeriodWorkouts.length === 0) continue;
      
      // Calculate average 1RM for each rep range in each period
      const calculateAvg1RMByRepRange = (workouts: WorkoutLog[]) => {
        const result = {
          low: { sum: 0, count: 0 },
          medium: { sum: 0, count: 0 },
          high: { sum: 0, count: 0 }
        };
        
        workouts.forEach(workout => {
          workout.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
              let repRange: 'low' | 'medium' | 'high';
              if (set.reps <= 5) repRange = 'low';
              else if (set.reps <= 12) repRange = 'medium';
              else repRange = 'high';
              
              const oneRM = calculate1RM(set.weight, set.reps);
              result[repRange].sum += oneRM;
              result[repRange].count++;
            });
          });
        });
        
        return {
          low: result.low.count > 0 ? result.low.sum / result.low.count : 0,
          medium: result.medium.count > 0 ? result.medium.sum / result.medium.count : 0,
          high: result.high.count > 0 ? result.high.sum / result.high.count : 0
        };
      };
      
      const startAvgs = calculateAvg1RMByRepRange(startPeriodWorkouts);
      const endAvgs = calculateAvg1RMByRepRange(endPeriodWorkouts);
      
      // Calculate improvement percentages
      ['low', 'medium', 'high'].forEach(range => {
        const rangeKey = range as keyof typeof startAvgs;
        
        if (startAvgs[rangeKey] > 0 && endAvgs[rangeKey] > 0) {
          const improvement = ((endAvgs[rangeKey] - startAvgs[rangeKey]) / startAvgs[rangeKey]) * 100;
          repRangeProgress[range].improvement += improvement;
          repRangeProgress[range].count++;
        }
      });
    }
    
    // Calculate average improvement per rep range
    const avgImprovements = Object.entries(repRangeProgress).map(([range, data]) => ({
      range,
      improvement: data.count > 0 ? data.improvement / data.count : 0
    })).sort((a, b) => b.improvement - a.improvement);
    
    // Generate recommendations based on improvement data
    let recommendation = "";
    let bestRange = "";
    
    if (avgImprovements.length > 0 && avgImprovements[0].improvement > 0) {
      bestRange = avgImprovements[0].range;
      
      if (bestRange === 'low') {
        recommendation = "You're making excellent progress with low rep training. Consider focusing on the 3-5 rep range for continued strength gains.";
      } else if (bestRange === 'medium') {
        recommendation = "Your best progress is in the moderate rep range. A focus on 8-12 reps appears optimal for your development.";
      } else {
        recommendation = "You're responding well to higher rep training. Continue with 12+ reps for endurance and muscular development.";
      }
    } else {
      recommendation = "Based on your data, try varying rep ranges to identify your optimal training zone.";
    }
    
    return {
      strength: bestRange === 'low' ? "3-5 reps (recommended)" : "3-5 reps",
      hypertrophy: bestRange === 'medium' ? "8-12 reps (recommended)" : "8-12 reps",
      endurance: bestRange === 'high' ? "12-15+ reps (recommended)" : "12-15+ reps",
      recommendation
    };
  };

  if (error) return <div>Failed to load</div>;
  if (!data)
    return (
      <div className="py-10 flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (data.length === 0)
    return <div className="text-zinc-500">Previous performances of this exercise will display here - check back later!</div>;

  // Show spinner until the model is fully loaded
  if (modelLoading)
    return (
      <div className="py-10 flex items-center justify-center">
        <Spinner />
        <span className="ml-2">Loading Advanced Analysis Model...</span>
      </div>
    );

  // Process records for display
  const { bestByReps, maxVolume, max1RM } = processRecords(data || []);
  const repRanges = getOptimalRepRanges();

  return (
    <div>
      <h4 className="uppercase text-xs text-zinc-500 mb-3">Personal Records</h4>
      <ul className="space-y-3">
        <li className="flex justify-between">
          <span>Estimated 1RM</span>
          <span>{max1RM.toFixed(1)} lbs</span>
        </li>
        <li className="flex justify-between">
          <span>Best Weight</span>
          <span>
            {maxVolume.weight} lbs (x{maxVolume.reps})
          </span>
        </li>
        <li className="flex justify-between">
          <span>Max Volume</span>
          <span>{maxVolume.volume} lbs</span>
        </li>
        {performanceImprovement !== null && (
          <li className="flex justify-between">
            <span>Progress Trend</span>
            <span className={performanceImprovement > 0 ? "text-green-500" : "text-red-500"}>
              {performanceImprovement > 0 ? "+" : ""}{performanceImprovement.toFixed(1)}%
            </span>
          </li>
        )}
      </ul>

      <Divider className="my-3" />
      
      <div className="mb-4">
        <h4 className="uppercase text-xs text-zinc-500 mb-2">Optimal Training Zones</h4>
        <ul className="text-sm space-y-1">
          <li className="flex justify-between">
            <span>Strength:</span>
            <span>{repRanges.strength}</span>
          </li>
          <li className="flex justify-between">
            <span>Hypertrophy:</span>
            <span>{repRanges.hypertrophy}</span>
          </li>
          <li className="flex justify-between">
            <span>Endurance:</span>
            <span>{repRanges.endurance}</span>
          </li>
        </ul>
        <p className="text-xs mt-2 text-zinc-500">{repRanges.recommendation}</p>
      </div>

      <Divider className="my-3" />

      <table className="w-full text-center">
        <thead className="text-xs text-zinc-500 uppercase">
          <tr>
            <th className="font-medium">Reps</th>
            <th className="font-medium">Best Performance</th>
            <th className="font-medium">Predicted</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 12 }, (_, index) => index + 1).map((reps) => {
            // Determine rep range for specific prediction
            let repRange: 'low' | 'medium' | 'high';
            if (reps <= 5) repRange = 'low';
            else if (reps <= 10) repRange = 'medium';
            else repRange = 'high';
            
            const predictedWeight = predictWeightForReps(max1RM, reps);
            const isPR = bestByReps[reps - 1]?.weight > 0 && 
                       (predictedWeight && predictedWeight > bestByReps[reps - 1].weight);

            return (
              <tr key={reps}>
                <td>{reps}</td>
                <td>
                  {bestByReps[reps - 1]?.weight > 0 ? (
                    <>
                      <div>{`${bestByReps[reps - 1].weight} lbs`}</div>
                      <div className="text-xs">{new Date(bestByReps[reps - 1].date).toLocaleDateString()}</div>
                    </>
                  ) : (
                    <div>-</div>
                  )}
                </td>
                <td className={isPR ? "text-green-500 font-semibold" : ""}>
                  {predictedWeight ? `${predictedWeight} lbs` : "N/A"}
                  {isPR && <span className="text-xs block">Potential PR</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {model.trainingMetrics && (
        <div className="mt-4 text-xs text-zinc-500">
          <p>Model accuracy: {(100 - (model.trainingMetrics.validationAccuracy || 0)).toFixed(1)}%</p>
          <p>Trained on {model.trainingMetrics.dataPoints} data points</p>
        </div>
      )}
      
      {exerciseSpecificData && (
        <div className="mt-4 text-sm">
          <Divider className="my-3" />
          <h4 className="uppercase text-xs text-zinc-500 mb-2">Optimization Tips</h4>
          <p className="text-xs text-zinc-500">{exerciseSpecificData.tips || "Keep training consistently to generate personalized recommendations."}</p>
        </div>
      )}
    </div>
  );
}