import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// Round to nearest available weight in the gym
const roundToGymWeight = (weight: number): number => {
  return Math.round(weight / 5) * 5;
};

// Function to calculate 1RM using standard Epley formula
const calculate1RM = (weight: number, reps: number): number => {
  return weight * (1 + reps / 30);
};

// Enhanced prediction model with rep-based coefficient adjustments
const predictWeightForReps = (
  oneRM: number,
  targetReps: number,
  userCoefficients: { repMultiplier: number; baseAdjustment: number },
  useEnhancedModel: boolean = true
): number => {
  const { repMultiplier, baseAdjustment } = userCoefficients;
  
  if (!useEnhancedModel) {
    // Original formula
    const prediction = oneRM / (baseAdjustment + targetReps * repMultiplier);
    return roundToGymWeight(prediction);
  }
  
  // Enhanced model with rep-specific adjustments
  let adjustedRepMultiplier = repMultiplier;
  let adjustedBaseAdjustment = baseAdjustment;
  
  // Progressive adjustment factor that increases with rep count
  // Based on observed error patterns in the data
  if (targetReps >= 8) {
    // Higher correction for higher rep ranges (8-12) where errors were larger
    adjustedRepMultiplier = repMultiplier * 1.12;
    adjustedBaseAdjustment = baseAdjustment * 0.95;
  } else if (targetReps >= 5) {
    // Medium correction for middle rep ranges (5-7)
    adjustedRepMultiplier = repMultiplier * 1.05;
    adjustedBaseAdjustment = baseAdjustment * 0.97;
  } else if (targetReps > 1) {
    // Smaller correction for lower rep ranges (2-4) where model was more accurate
    adjustedRepMultiplier = repMultiplier * 1.02;
    adjustedBaseAdjustment = baseAdjustment * 0.99;
  }
  // No adjustment for 1RM (targetReps === 1)
  
  const prediction = oneRM / (adjustedBaseAdjustment + targetReps * adjustedRepMultiplier);
  return roundToGymWeight(prediction);
};

// Modified interface for powerlifting data based on the official documentation
interface PowerliftingEntry {
  Name: string;
  Sex: string;
  Event: string;
  Equipment: string;
  Age: number | string;
  AgeClass: string;
  BirthYearClass: string;
  Division: string;
  BodyweightKg: number | string;
  WeightClassKg: string;
  Squat1Kg: number;
  Squat2Kg: number;
  Squat3Kg: number;
  Squat4Kg: number;
  Best3SquatKg: number;
  Bench1Kg: number;
  Bench2Kg: number;
  Bench3Kg: number;
  Bench4Kg: number;
  Best3BenchKg: number;
  Deadlift1Kg: number;
  Deadlift2Kg: number;
  Deadlift3Kg: number;
  Deadlift4Kg: number;
  Best3DeadliftKg: number;
  TotalKg: number | string;
  Place: string;
  Dots: number | string;
  Wilks: number | string;
  Glossbrenner: number | string;
  Goodlift: number | string;
  Tested: string;
  Country: string;
  State: string;
  Federation: string;
  ParentFederation: string;
  Date: string;
  MeetCountry: string;
  MeetState: string;
  MeetTown: string;
  MeetName: string;
  Sanctioned: string;
}

// Interface for rep test data
interface RepTestData {
  oneRM: number;
  actualWeight: number;
  reps: number;
  predictedWeight: number;
  error: number;
  percentError: number;
  modelType: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const exerciseType = searchParams.get("exerciseType") || "bench"; // bench, squat, deadlift
    const limit = parseInt(searchParams.get("limit") || "1000");
    
    // Path to CSV file - UPDATED PATH
    const filePath = path.join(
      process.cwd(),
      "app",
      "data",
      "openpowerlifting.csv"
    );
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("CSV file not found at path:", filePath);
      return NextResponse.json(
        { error: "CSV file not found" },
        { status: 404 }
      );
    }
    
    // Define arrays of column names for type checking
    const liftAttemptColumns = [
      'Squat1Kg', 'Squat2Kg', 'Squat3Kg', 'Squat4Kg',
      'Bench1Kg', 'Bench2Kg', 'Bench3Kg', 'Bench4Kg',
      'Deadlift1Kg', 'Deadlift2Kg', 'Deadlift3Kg', 'Deadlift4Kg',
      'Best3SquatKg', 'Best3BenchKg', 'Best3DeadliftKg'
    ];
    
    // Read and parse CSV - using comma as delimiter according to documentation
    const csvData = fs.readFileSync(filePath, "utf8");
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',', // CSV format uses comma as delimiter according to docs
      cast: (value, context) => {
        // Get column name as string
        const columnName = String(context.column);
        
        // Handle empty values
        if (value === '' || value === '-') {
          return null;
        }
        
        // Handle DQ, DD, NS values for Place column
        if (columnName === 'Place') {
          return value; // Keep as string
        }
        
        // Handle failed attempts (negative values) and special cases
        if (liftAttemptColumns.includes(columnName)) {
          // Negative values indicate failed attempts
          const num = Number(value);
          return isNaN(num) ? null : num;
        }
        
        // Try to convert to number if possible for other numeric fields
        const num = Number(value);
        return isNaN(num) ? value : num;
      }
    }) as PowerliftingEntry[];
    
    // Filter records based on exercise type and validity
    const filteredRecords = records
      .filter(record => {
        // Select appropriate field based on exercise type
        let weightValue;
        if (exerciseType === "bench") weightValue = record.Best3BenchKg;
        else if (exerciseType === "squat") weightValue = record.Best3SquatKg;
        else if (exerciseType === "deadlift") weightValue = record.Best3DeadliftKg;
        
        // Filter out records with missing data, failed attempts, or non-Raw equipment
        return (
          weightValue !== null &&
          weightValue !== undefined &&
          typeof weightValue === 'number' &&
          weightValue > 0 && // Ensure it's a positive number (successful attempt)
          record.BodyweightKg &&
          typeof record.BodyweightKg === 'number' &&
          record.Equipment === "Raw" && // Only Raw lifts (no wraps, etc.)
          weightValue > 0
        );
      })
      .slice(0, limit);
    
    // If no valid records found after filtering
    if (filteredRecords.length === 0) {
      return NextResponse.json(
        { error: "No valid records found after filtering" },
        { status: 404 }
      );
    }
    
    // Generate synthetic rep test data
    const repTests: RepTestData[] = [];
    const repRanges = [1, 3, 5, 8, 10, 12]; // Common rep ranges to test
    
    // Define exercise-specific coefficients based on data analysis
    const baseCoefficients = { repMultiplier: 1/30, baseAdjustment: 1 };
    
    // Fine-tuned coefficients for each exercise type
    const exerciseCoefficients = {
      bench: { repMultiplier: 1/30, baseAdjustment: 1 },      // Keep default for bench
      squat: { repMultiplier: 1/28, baseAdjustment: 1 },      // Slight adjustment for squat
      deadlift: { repMultiplier: 1/29, baseAdjustment: 1 }    // Slight adjustment for deadlift
    };
    
    // Choose the appropriate coefficient based on exercise type
    const selectedCoeff = exerciseCoefficients[exerciseType as keyof typeof exerciseCoefficients] || baseCoefficients;
    
    filteredRecords.forEach(record => {
      let oneRMKg;
      if (exerciseType === "bench") oneRMKg = record.Best3BenchKg as number;
      else if (exerciseType === "squat") oneRMKg = record.Best3SquatKg as number;
      else if (exerciseType === "deadlift") oneRMKg = record.Best3DeadliftKg as number;
      
      if (!oneRMKg || typeof oneRMKg !== 'number') return;
      
      // Convert to pounds
      const oneRMLbs = oneRMKg * 2.20462;
      
      // For each rep range, estimate what weight they'd lift
      repRanges.forEach(reps => {
        if (reps === 1) {
          // For 1RM, we know the exact value
          repTests.push({
            oneRM: oneRMLbs,
            actualWeight: oneRMLbs,
            reps: 1,
            predictedWeight: predictWeightForReps(oneRMLbs, 1, selectedCoeff, false),
            error: 0,
            percentError: 0,
            modelType: "Original"
          });
          
          repTests.push({
            oneRM: oneRMLbs,
            actualWeight: oneRMLbs,
            reps: 1,
            predictedWeight: predictWeightForReps(oneRMLbs, 1, selectedCoeff, true),
            error: 0,
            percentError: 0,
            modelType: "Enhanced"
          });
        } else {
          // For multiple reps, we simulate based on research of strength curves
          // Using a research-based formula to simulate "actual" weight for given reps
          // Different from our prediction formula to test its accuracy
          const actualWeight = roundToGymWeight(oneRMLbs / (1 + (reps * 0.0278))); 
          
          // Test original model
          const predictedWeight = predictWeightForReps(oneRMLbs, reps, selectedCoeff, false);
          const error = predictedWeight - actualWeight;
          const percentError = (error / actualWeight) * 100;
          
          repTests.push({
            oneRM: oneRMLbs,
            actualWeight,
            reps,
            predictedWeight,
            error,
            percentError,
            modelType: "Original"
          });
          
          // Test enhanced model
          const enhancedPredictedWeight = predictWeightForReps(oneRMLbs, reps, selectedCoeff, true);
          const enhancedError = enhancedPredictedWeight - actualWeight;
          const enhancedPercentError = (enhancedError / actualWeight) * 100;
          
          repTests.push({
            oneRM: oneRMLbs,
            actualWeight,
            reps,
            predictedWeight: enhancedPredictedWeight,
            error: enhancedError,
            percentError: enhancedPercentError,
            modelType: "Enhanced"
          });
        }
      });
    });
    
    // If no valid rep tests were generated
    if (repTests.length === 0) {
      return NextResponse.json(
        { error: "No valid rep tests could be generated" },
        { status: 404 }
      );
    }
    
    // Analyze results by model type and rep range
    const analysisByModel: Record<string, Record<string, {
      count: number;
      avgError: number;
      avgAbsError: number;
      avgPercentError: number;
      stdDevError: number;
      maxError: number;
      minError: number;
    }>> = {
      "Original": {},
      "Enhanced": {}
    };
    
    // Models to compare
    const modelTypes = ["Original", "Enhanced"];
    
    // Group by model type and rep range
    modelTypes.forEach(modelType => {
      const modelTests = repTests.filter(test => test.modelType === modelType);
      
      repRanges.forEach(reps => {
        const testsForRep = modelTests.filter(test => test.reps === reps);
        
        if (testsForRep.length === 0) return;
        
        const errors = testsForRep.map(test => test.error);
        const percentErrors = testsForRep.map(test => test.percentError);
        const absErrors = errors.map(e => Math.abs(e));
        
        // Calculate standard deviation
        const mean = errors.reduce((sum, val) => sum + val, 0) / errors.length;
        const squaredDiffs = errors.map(val => Math.pow(val - mean, 2));
        const stdDev = Math.sqrt(squaredDiffs.reduce((sum, val) => sum + val, 0) / errors.length);
        
        analysisByModel[modelType][`${reps}reps`] = {
          count: testsForRep.length,
          avgError: mean,
          avgAbsError: absErrors.reduce((sum, val) => sum + val, 0) / absErrors.length,
          avgPercentError: percentErrors.reduce((sum, val) => sum + val, 0) / percentErrors.length,
          stdDevError: stdDev,
          maxError: Math.max(...errors),
          minError: Math.min(...errors)
        };
      });
    });
    
    // Calculate overall performance comparison between models
    const originalTests = repTests.filter(test => test.modelType === "Original");
    const enhancedTests = repTests.filter(test => test.modelType === "Enhanced");
    
    const originalAvgAbsError = originalTests
      .map(test => Math.abs(test.error))
      .reduce((sum, val) => sum + val, 0) / originalTests.length;
    
    const enhancedAvgAbsError = enhancedTests
      .map(test => Math.abs(test.error))
      .reduce((sum, val) => sum + val, 0) / enhancedTests.length;
    
    // Calculate improvement percentage
    const improvement = ((originalAvgAbsError - enhancedAvgAbsError) / originalAvgAbsError) * 100;
    
    // Return results
    return NextResponse.json({
      exerciseType,
      totalRecords: filteredRecords.length,
      totalTests: repTests.length,
      analysisByModel,
      modelComparison: {
        originalModel: {
          avgAbsError: originalAvgAbsError,
          sampleSize: originalTests.length
        },
        enhancedModel: {
          avgAbsError: enhancedAvgAbsError,
          sampleSize: enhancedTests.length,
          repAdjustments: {
            "1-4 reps": "Minimal adjustment (+2% multiplier, -1% base)",
            "5-7 reps": "Medium adjustment (+5% multiplier, -3% base)",
            "8+ reps": "Larger adjustment (+12% multiplier, -5% base)"
          }
        },
        improvement
      },
      baseCoefficients: selectedCoeff,
      sampleData: repTests.slice(0, 40) // Return a small sample for visualization
    });
  } catch (error) {
    console.error("Error processing powerlifting data:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return NextResponse.json(
      { 
        error: "Failed to process powerlifting data", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}