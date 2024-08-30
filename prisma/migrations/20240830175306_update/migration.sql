/*
  Warnings:

  - The values [e-z curl bar] on the enum `EquipmentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EquipmentType_new" AS ENUM ('body only', 'machine', 'other', 'foam roll', 'kettlebells', 'dumbbell', 'cable', 'barbell', 'bands', 'medicine ball', 'exercise ball', 'ez curl bar');
ALTER TABLE "Exercise" ALTER COLUMN "equipment" TYPE "EquipmentType_new" USING ("equipment"::text::"EquipmentType_new");
ALTER TABLE "UserEquipment" ALTER COLUMN "equipmentType" TYPE "EquipmentType_new" USING ("equipmentType"::text::"EquipmentType_new");
ALTER TYPE "EquipmentType" RENAME TO "EquipmentType_old";
ALTER TYPE "EquipmentType_new" RENAME TO "EquipmentType";
DROP TYPE "EquipmentType_old";
COMMIT;
