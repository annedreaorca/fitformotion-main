/*
  Warnings:

  - You are about to drop the column `age` on the `UserInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "age",
ADD COLUMN     "birthdate" TIMESTAMP(3);
