/*
  Warnings:

  - You are about to drop the column `description` on the `Group` table. All the data in the column will be lost.
  - Added the required column `profileImage` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Group" DROP COLUMN "description",
ADD COLUMN     "discription" TEXT,
ADD COLUMN     "profileImage" TEXT NOT NULL;
