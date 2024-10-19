-- DropForeignKey
ALTER TABLE "UserWeight" DROP CONSTRAINT "UserWeight_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserWeight" ADD CONSTRAINT "UserWeight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
