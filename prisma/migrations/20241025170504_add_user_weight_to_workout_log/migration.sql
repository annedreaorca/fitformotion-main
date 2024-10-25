-- CreateTable
CREATE TABLE "_UserWeightsToWorkoutLogs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserWeightsToWorkoutLogs_AB_unique" ON "_UserWeightsToWorkoutLogs"("A", "B");

-- CreateIndex
CREATE INDEX "_UserWeightsToWorkoutLogs_B_index" ON "_UserWeightsToWorkoutLogs"("B");

-- AddForeignKey
ALTER TABLE "_UserWeightsToWorkoutLogs" ADD CONSTRAINT "_UserWeightsToWorkoutLogs_A_fkey" FOREIGN KEY ("A") REFERENCES "UserWeight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWeightsToWorkoutLogs" ADD CONSTRAINT "_UserWeightsToWorkoutLogs_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkoutLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
