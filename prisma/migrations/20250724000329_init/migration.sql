-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'ATTENDED', 'MISSED');

-- CreateTable
CREATE TABLE "Patient" (
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

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patientId")
);

-- CreateTable
CREATE TABLE "Doctor" (
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

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("doctorId")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalOrder" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientId_key" ON "Patient"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_id_key" ON "Patient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_doctorId_key" ON "Doctor"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_id_key" ON "Doctor"("id");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("patientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("doctorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalOrder" ADD CONSTRAINT "MedicalOrder_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
