/*
  Warnings:

  - You are about to drop the `discarded_jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `liked_jobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "discarded_jobs" DROP CONSTRAINT "discarded_jobs_applicant_id_fkey";

-- DropForeignKey
ALTER TABLE "discarded_jobs" DROP CONSTRAINT "discarded_jobs_job_id_fkey";

-- DropForeignKey
ALTER TABLE "liked_jobs" DROP CONSTRAINT "liked_jobs_applicant_id_fkey";

-- DropForeignKey
ALTER TABLE "liked_jobs" DROP CONSTRAINT "liked_jobs_job_id_fkey";

-- DropTable
DROP TABLE "discarded_jobs";

-- DropTable
DROP TABLE "liked_jobs";

-- CreateTable
CREATE TABLE "applicant_discarded_jobs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "job_id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,

    CONSTRAINT "applicant_discarded_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_liked_jobs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "job_id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,

    CONSTRAINT "applicant_liked_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employer_liked_applicants" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "employer_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,

    CONSTRAINT "employer_liked_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employer_discarded_applicants" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "employer_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,

    CONSTRAINT "employer_discarded_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applicant_discarded_jobs_job_id_applicant_id_key" ON "applicant_discarded_jobs"("job_id", "applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "applicant_liked_jobs_job_id_applicant_id_key" ON "applicant_liked_jobs"("job_id", "applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "employer_liked_applicants_job_id_employer_id_applicant_id_key" ON "employer_liked_applicants"("job_id", "employer_id", "applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "employer_discarded_applicants_job_id_employer_id_applicant__key" ON "employer_discarded_applicants"("job_id", "employer_id", "applicant_id");

-- AddForeignKey
ALTER TABLE "applicant_discarded_jobs" ADD CONSTRAINT "applicant_discarded_jobs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_discarded_jobs" ADD CONSTRAINT "applicant_discarded_jobs_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_liked_jobs" ADD CONSTRAINT "applicant_liked_jobs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_liked_jobs" ADD CONSTRAINT "applicant_liked_jobs_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employer_liked_applicants" ADD CONSTRAINT "employer_liked_applicants_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employer_liked_applicants" ADD CONSTRAINT "employer_liked_applicants_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employer_liked_applicants" ADD CONSTRAINT "employer_liked_applicants_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employer_discarded_applicants" ADD CONSTRAINT "employer_discarded_applicants_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employer_discarded_applicants" ADD CONSTRAINT "employer_discarded_applicants_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employer_discarded_applicants" ADD CONSTRAINT "employer_discarded_applicants_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
