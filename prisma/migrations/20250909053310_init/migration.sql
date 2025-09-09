/*
  Warnings:

  - A unique constraint covering the columns `[groupId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_groupId_key" ON "public"."Chat"("groupId");
