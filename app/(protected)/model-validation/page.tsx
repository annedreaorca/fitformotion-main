"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

// Define types for our data structures
interface RepAdjustment {
  [range: string]: string;
}

interface ModelStats {
  avgAbsError: number;
  sampleSize: number;
  repAdjustments?: RepAdjustment;
}

interface ModelComparison {
  originalModel: ModelStats;
  enhancedModel: ModelStats;
  improvement: number;
}

interface BaseCoefficients {
  repMultiplier: number;
}

interface RepRangeAnalysis {
  count: number;
  avgError: number;
  avgAbsError: number;
  avgPercentError: number;
  stdDevError: number;
}

interface AnalysisByModel {
  Original: {
    [repRange: string]: RepRangeAnalysis;
  };
  Enhanced: {
    [repRange: string]: RepRangeAnalysis;
  };
}

interface SampleDataItem {
  oneRM: number;
  reps: number;
  actualWeight: number;
  predictedWeight: number;
  error: number;
  percentError: number;
  modelType: "Original" | "Enhanced";
}

interface ValidationData {
  modelComparison: ModelComparison;
  baseCoefficients: BaseCoefficients;
  analysisByModel: AnalysisByModel;
  sampleData: SampleDataItem[];
}

// Define chart data types
interface ModelComparisonDataItem {
  reps: number;
  originalError: number;
  enhancedError: number;
  originalPercentError: number;
  enhancedPercentError: number;
  improvement: number;
}

interface ImprovementDataItem {
  reps: number;
  improvement: number;
}

interface ScatterDataItem {
  oneRM: number;
  reps: number;
  actual: number;
  predicted: number;
  error: number;
  percentError: number;
  modelType: "Original" | "Enhanced";
}

export default function ModelValidationPage() {
  const [exerciseType, setExerciseType] = useState<string>("bench");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ValidationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/model-validation?exerciseType=${type}&limit=1000`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setData(result as ValidationData);
    } catch (err) {
      setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(exerciseType);
  }, [exerciseType]);

  // Prepare chart data for model comparison
  const prepareModelComparisonData = (): ModelComparisonDataItem[] => {
    if (!data?.analysisByModel) return [];
    
    const comparisonData: ModelComparisonDataItem[] = [];
    
    // Get all rep ranges from either model
    const repRanges = Object.keys(data.analysisByModel.Original || {});
    
    repRanges.forEach(repRange => {
      const originalData = data.analysisByModel.Original[repRange];
      const enhancedData = data.analysisByModel.Enhanced[repRange];
      
      if (originalData && enhancedData) {
        comparisonData.push({
          reps: parseInt(repRange.replace('reps', '')),
          originalError: parseFloat(originalData.avgAbsError.toFixed(2)),
          enhancedError: parseFloat(enhancedData.avgAbsError.toFixed(2)),
          originalPercentError: parseFloat(originalData.avgPercentError.toFixed(2)),
          enhancedPercentError: parseFloat(enhancedData.avgPercentError.toFixed(2)),
          improvement: parseFloat(((originalData.avgAbsError - enhancedData.avgAbsError) / originalData.avgAbsError * 100).toFixed(2))
        });
      }
    });
    
    return comparisonData;
  };

  // Prepare scatter data with model type
  const prepareScatterData = (): ScatterDataItem[] => {
    if (!data?.sampleData) return [];
    
    return data.sampleData.map((item) => ({
      oneRM: item.oneRM,
      reps: item.reps,
      actual: item.actualWeight,
      predicted: item.predictedWeight,
      error: item.error,
      percentError: parseFloat(item.percentError.toFixed(2)),
      modelType: item.modelType
    }));
  };

  // Prepare improvement data by rep range
  const prepareImprovementData = (): ImprovementDataItem[] => {
    if (!data?.analysisByModel) return [];
    
    const improvementData: ImprovementDataItem[] = [];
    
    // Get all rep ranges from either model
    const repRanges = Object.keys(data.analysisByModel.Original || {});
    
    repRanges.forEach(repRange => {
      const originalData = data.analysisByModel.Original[repRange];
      const enhancedData = data.analysisByModel.Enhanced[repRange];
      
      if (originalData && enhancedData) {
        const improvementPercent = ((originalData.avgAbsError - enhancedData.avgAbsError) / originalData.avgAbsError * 100);
        
        improvementData.push({
          reps: parseInt(repRange.replace('reps', '')),
          improvement: parseFloat(improvementPercent.toFixed(2))
        });
      }
    });
    
    return improvementData;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Enhanced Model Validation Dashboard</h1>
      
      <div className="mb-6">
        <Tabs 
          selectedKey={exerciseType} 
          onSelectionChange={(key) => setExerciseType(key as string)}
        >
          <Tab key="bench" title="Bench Press" />
          <Tab key="squat" title="Squat" />
          <Tab key="deadlift" title="Deadlift" />
        </Tabs>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
          <span className="ml-2">Loading validation data...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border border-red-300 rounded">
          {error}
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="font-bold text-lg">Model Improvement Overview</h4>
              <p className="text-sm text-gray-500">
                {data.modelComparison?.improvement.toFixed(2)}% overall improvement with the enhanced model
              </p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <h5 className="font-semibold">Original Model</h5>
                  <p>Avg Absolute Error: {data.modelComparison?.originalModel.avgAbsError.toFixed(2)} lbs</p>
                  <p>Base Coefficient: 1/{Math.round(1/data.baseCoefficients.repMultiplier)}</p>
                  <p>Sample Size: {data.modelComparison?.originalModel.sampleSize}</p>
                </div>
                
                <div className="p-4 border rounded">
                  <h5 className="font-semibold">Enhanced Model</h5>
                  <p>Avg Absolute Error: {data.modelComparison?.enhancedModel.avgAbsError.toFixed(2)} lbs</p>
                  <p>Base Coefficient: 1/{Math.round(1/data.baseCoefficients.repMultiplier)} with rep-specific adjustments</p>
                  <p className="text-green-500">
                    Improvement: {data.modelComparison?.improvement.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Rep-Specific Adjustments</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {data.modelComparison?.enhancedModel.repAdjustments && Object.entries(data.modelComparison.enhancedModel.repAdjustments).map(([range, adjustment]) => (
                    <div key={range} className="p-2 border rounded">
                      <p className="font-medium">{range}</p>
                      <p className="text-sm">{adjustment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="font-bold text-lg">Model Comparison</h4>
              <p className="text-sm text-gray-500">
                Error comparison between original and enhanced models
              </p>
            </CardHeader>
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareModelComparisonData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="reps" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="originalError" 
                      name="Original Model Error (lbs)" 
                      fill="#8884d8"
                      stroke="#8884d8"
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="enhancedError" 
                      name="Enhanced Model Error (lbs)" 
                      fill="#82ca9d"
                      stroke="#82ca9d"
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="font-bold text-lg">Improvement by Rep Range</h4>
              <p className="text-sm text-gray-500">
                Percentage improvement of enhanced model by rep range
              </p>
            </CardHeader>
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareImprovementData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="reps" />
                    <YAxis label={{ value: "Improvement %", angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="improvement" 
                      name="Improvement %" 
                      fill="#82ca9d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="font-bold text-lg">Prediction Comparison</h4>
              <p className="text-sm text-gray-500">
                Visualizing accuracy of both models
              </p>
            </CardHeader>
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="actual" name="Actual Weight (lbs)" />
                    <YAxis dataKey="predicted" name="Predicted Weight (lbs)" />
                    <ZAxis dataKey="reps" name="Reps" range={[50, 400]} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        value, 
                        name === "z" ? "Reps" : name
                      ]}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Legend />
                    <Scatter 
                      name="Original Model" 
                      data={prepareScatterData().filter(item => item.modelType === "Original")} 
                      fill="#8884d8" 
                    />
                    <Scatter 
                      name="Enhanced Model" 
                      data={prepareScatterData().filter(item => item.modelType === "Enhanced")} 
                      fill="#82ca9d" 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="font-bold text-lg">Detailed Analysis by Rep Range</h4>
              <p className="text-sm text-gray-500">
                Performance metrics across different rep ranges
              </p>
            </CardHeader>
            <CardBody>
              <Tabs>
                <Tab key="original" title="Original Model">
                  <Table aria-label="Original Model Analysis by Rep Range">
                    <TableHeader>
                      <TableColumn>REPS</TableColumn>
                      <TableColumn>SAMPLE SIZE</TableColumn>
                      <TableColumn>AVG ERROR (LBS)</TableColumn>
                      <TableColumn>AVG ABS ERROR (LBS)</TableColumn>
                      <TableColumn>AVG ERROR (%)</TableColumn>
                      <TableColumn>STD DEV</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {data.analysisByModel?.Original && Object.entries(data.analysisByModel.Original).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell>{key.replace('reps', '')}</TableCell>
                          <TableCell>{value.count}</TableCell>
                          <TableCell>{value.avgError.toFixed(2)}</TableCell>
                          <TableCell>{value.avgAbsError.toFixed(2)}</TableCell>
                          <TableCell>{value.avgPercentError.toFixed(2)}%</TableCell>
                          <TableCell>{value.stdDevError.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Tab>
                <Tab key="enhanced" title="Enhanced Model">
                  <Table aria-label="Enhanced Model Analysis by Rep Range">
                    <TableHeader>
                      <TableColumn>REPS</TableColumn>
                      <TableColumn>SAMPLE SIZE</TableColumn>
                      <TableColumn>AVG ERROR (LBS)</TableColumn>
                      <TableColumn>AVG ABS ERROR (LBS)</TableColumn>
                      <TableColumn>AVG ERROR (%)</TableColumn>
                      <TableColumn>STD DEV</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {data.analysisByModel?.Enhanced && Object.entries(data.analysisByModel.Enhanced).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell>{key.replace('reps', '')}</TableCell>
                          <TableCell>{value.count}</TableCell>
                          <TableCell>{value.avgError.toFixed(2)}</TableCell>
                          <TableCell>{value.avgAbsError.toFixed(2)}</TableCell>
                          <TableCell>{value.avgPercentError.toFixed(2)}%</TableCell>
                          <TableCell>{value.stdDevError.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="font-bold text-lg">Sample Data Comparison</h4>
              <p className="text-sm text-gray-500">
                Sample predictions from both models
              </p>
            </CardHeader>
            <CardBody>
              <Table aria-label="Sample Data">
                <TableHeader>
                  <TableColumn>1RM (LBS)</TableColumn>
                  <TableColumn>REPS</TableColumn>
                  <TableColumn>ACTUAL WEIGHT</TableColumn>
                  <TableColumn>PREDICTED WEIGHT</TableColumn>
                  <TableColumn>ERROR (LBS)</TableColumn>
                  <TableColumn>ERROR (%)</TableColumn>
                  <TableColumn>MODEL</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.sampleData && data.sampleData.map((item, index) => (
                    <TableRow key={index} className={item.modelType === "Enhanced" ? "bg-zinc-800" : ""}>
                      <TableCell>{item.oneRM.toFixed(1)}</TableCell>
                      <TableCell>{item.reps}</TableCell>
                      <TableCell>{item.actualWeight.toFixed(1)}</TableCell>
                      <TableCell>{item.predictedWeight.toFixed(1)}</TableCell>
                      <TableCell>{item.error.toFixed(1)}</TableCell>
                      <TableCell>{item.percentError.toFixed(2)}%</TableCell>
                      <TableCell>{item.modelType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      ) : null}
    </div>
  );
}