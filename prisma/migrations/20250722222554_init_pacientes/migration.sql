-- CreateTable
CREATE TABLE "Paciente" (
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

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("patientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_patientId_key" ON "Paciente"("patientId");
