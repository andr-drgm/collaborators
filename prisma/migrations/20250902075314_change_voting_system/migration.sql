/*
  Warnings:

  - You are about to drop the column `voteCount` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "voteCount",
ADD COLUMN     "tweetUrl" TEXT;

-- DropTable
DROP TABLE "public"."Vote";
