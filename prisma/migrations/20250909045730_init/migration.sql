-- AlterTable (make groupId optional by removing NOT NULL)
ALTER TABLE "public"."Chat" ADD COLUMN "groupId" INTEGER;

-- AddForeignKey (remove the unique constraint for now)
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;