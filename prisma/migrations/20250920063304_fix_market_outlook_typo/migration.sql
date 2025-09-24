/*
  Warnings:

  - You are about to drop the column `markectOutLook` on the `IndustryInsight` table. All the data in the column will be lost.
  - Added the required column `marketOutLook` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."IndustryInsight" DROP COLUMN "markectOutLook",
ADD COLUMN     "marketOutLook" TEXT NOT NULL;
