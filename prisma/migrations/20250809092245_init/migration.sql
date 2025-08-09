/*
  Warnings:

  - You are about to drop the column `discription` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,chatId]` on the table `chatMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_replyToId_fkey";

-- DropIndex
DROP INDEX "public"."chatMember_chatId_key";

-- DropIndex
DROP INDEX "public"."chatMember_userId_key";

-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Message" ALTER COLUMN "replyToId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."chatMember" ALTER COLUMN "leftAt" DROP NOT NULL,
ALTER COLUMN "leftAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "chatMember_userId_chatId_key" ON "public"."chatMember"("userId", "chatId");

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "public"."Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
