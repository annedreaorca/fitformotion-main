"use client";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { WorkoutLog } from "./ModalChartTypes";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface PlaceholderModel {
	isLoaded: boolean;
}

export default function RecordsTab({ exerciseId }: { exerciseId: string | undefined }) {
	const [model, setModel] = useState<PlaceholderModel | null>(null);
	const [modelLoading, setModelLoading] = useState(true);


	useEffect(() => {
		const loadModel = async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				console.log("ML Model Loaded");
				setModel({ isLoaded: true }); 
			} catch (error) {
				console.error("Failed to load ML model:", error);
			} finally {
				setModelLoading(false);
			}
		};
		loadModel();
	}, []);

	// Function to calculate 1RM using Epley formula
	const calculate1RM = (weight: number, reps: number): number => weight * (1 + reps / 30);

	const predictWeightForReps = (oneRM: number, reps: number): number | null => {
		if (!model || !model.isLoaded) {
			console.log("Model not loaded yet.");
			return null;
		}

		console.log(`Prediction for ${reps} reps:`, oneRM * (0.7 + reps / 40));
		return parseFloat((oneRM * (0.7 + reps / 40)).toFixed(2)); 
	};

	// Process workout history and extract best performances
	const processRecords = (workouts: WorkoutLog[]) => {
		let bestByReps = Array.from({ length: 12 }, () => ({
			weight: 0,
			date: "",
		}));
		let maxVolume = { volume: 0, weight: 0, reps: 0, date: "" };
		let max1RM = 0;

		workouts.forEach((workout) => {
			workout.exercises.forEach((exercise) => {
				exercise.sets.forEach((set) => {
					const { weight, reps } = set;
					const volume = weight * reps;
					const estimated1RM = calculate1RM(weight, reps);

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

	const { data, error } = useSWR<WorkoutLog[]>(`/api/exercise-history/${exerciseId}`, fetcher);
	const { bestByReps, maxVolume, max1RM } = processRecords(data || []);

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
				<span className="ml-2">Loading Model...</span>
			</div>
		);

	return (
		<div>
			<h4 className="uppercase text-xs text-zinc-500 mb-3">Personal Records</h4>
			<ul className="space-y-3">
				<li className="flex justify-between">
					<span>1RM</span>
					<span>{max1RM.toFixed(2)} lbs</span>
				</li>
				<li className="flex justify-between">
					<span>Weight</span>
					<span>
						{maxVolume.weight} lbs (x{maxVolume.reps})
					</span>
				</li>
				<li className="flex justify-between">
					<span>Max Volume</span>
					<span>{maxVolume.volume} lbs</span>
				</li>
			</ul>

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
						const predictedWeight = predictWeightForReps(max1RM, reps);

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
								<td>{predictedWeight ? `${predictedWeight} lbs` : "N/A"}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
