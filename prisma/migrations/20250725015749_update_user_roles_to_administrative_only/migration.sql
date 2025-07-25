/*
  Warnings:

  - The values [DOCTOR,PATIENT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `doctorId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'RECEPTIONIST', 'NURSE', 'VIEWER');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_patientId_fkey";

-- DropIndex
DROP INDEX "users_doctorId_key";

-- DropIndex
DROP INDEX "users_patientId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "doctorId",
DROP COLUMN "patientId",
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);
