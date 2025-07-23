/*
  Warnings:

  - You are about to drop the column `fechaIngreso` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `tarjetaProfesional` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `businessCard` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "fechaIngreso",
DROP COLUMN "tarjetaProfesional",
ADD COLUMN     "businessCard" VARCHAR(50) NOT NULL,
ADD COLUMN     "dateOfAdmission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
