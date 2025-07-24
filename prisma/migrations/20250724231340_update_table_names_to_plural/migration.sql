/*
  Warnings:

  - The values [SUPER_ADMIN,NURSE] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalOrderMedication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalOrder" DROP CONSTRAINT "MedicalOrder_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalOrderMedication" DROP CONSTRAINT "MedicalOrderMedication_medicalOrderId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalOrderMedication" DROP CONSTRAINT "MedicalOrderMedication_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_patientId_fkey";

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "Doctor";

-- DropTable
DROP TABLE "MedicalOrder";

-- DropTable
DROP TABLE "MedicalOrderMedication";

-- DropTable
DROP TABLE "Medication";

-- DropTable
DROP TABLE "Patient";

-- CreateTable
CREATE TABLE "patients" (
    "patientId" TEXT NOT NULL,
    "id" VARCHAR(20) NOT NULL,
    "firstName" VARCHAR(90) NOT NULL,
    "lastName" VARCHAR(90) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "city" VARCHAR(90) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patientId")
);

-- CreateTable
CREATE TABLE "doctors" (
    "doctorId" TEXT NOT NULL,
    "id" VARCHAR(20) NOT NULL,
    "firstName" VARCHAR(90) NOT NULL,
    "lastName" VARCHAR(90) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "city" VARCHAR(90) NOT NULL,
    "businessCard" VARCHAR(50) NOT NULL,
    "dateOfAdmission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("doctorId")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_orders" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "appointmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "diseases" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_order_medications" (
    "id" TEXT NOT NULL,
    "medicalOrderId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT,
    "duration" TEXT,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_order_medications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_patientId_key" ON "patients"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_id_key" ON "patients"("id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_doctorId_key" ON "doctors"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_id_key" ON "doctors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "medications_name_key" ON "medications"("name");

-- CreateIndex
CREATE UNIQUE INDEX "medical_order_medications_medicalOrderId_medicationId_key" ON "medical_order_medications"("medicalOrderId", "medicationId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("patientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("doctorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_orders" ADD CONSTRAINT "medical_orders_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_order_medications" ADD CONSTRAINT "medical_order_medications_medicalOrderId_fkey" FOREIGN KEY ("medicalOrderId") REFERENCES "medical_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_order_medications" ADD CONSTRAINT "medical_order_medications_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("doctorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("patientId") ON DELETE SET NULL ON UPDATE CASCADE;
