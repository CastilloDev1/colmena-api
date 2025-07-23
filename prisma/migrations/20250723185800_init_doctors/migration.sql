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
    "tarjetaProfesional" VARCHAR(50) NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("doctorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_doctorId_key" ON "Doctor"("doctorId");
