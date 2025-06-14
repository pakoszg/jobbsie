-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "applicant_id" TEXT,
    "employer_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employers" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "website_url" TEXT,
    "category" TEXT NOT NULL,

    CONSTRAINT "employers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicants" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "introduction" TEXT,

    CONSTRAINT "applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "filename" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_categories" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "job_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_postings" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hourly_salary_range" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "job_name" TEXT NOT NULL,
    "employer_id" TEXT NOT NULL,
    "job_category_id" TEXT NOT NULL,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_discarded_jobs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "job_id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,

    CONSTRAINT "applicant_discarded_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_liked_jobs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "job_id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,

    CONSTRAINT "applicant_liked_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employer_liked_applicants" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
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
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "applicant_id" TEXT NOT NULL,
    "employer_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,

    CONSTRAINT "employer_discarded_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicantJobCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ApplicantJobCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_applicant_id_key" ON "users"("applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_employer_id_key" ON "users"("employer_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_categories_category_key" ON "job_categories"("category");

-- CreateIndex
CREATE UNIQUE INDEX "applicant_discarded_jobs_job_id_applicant_id_key" ON "applicant_discarded_jobs"("job_id", "applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "applicant_liked_jobs_job_id_applicant_id_key" ON "applicant_liked_jobs"("job_id", "applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "employer_liked_applicants_job_id_employer_id_applicant_id_key" ON "employer_liked_applicants"("job_id", "employer_id", "applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "employer_discarded_applicants_job_id_employer_id_applicant__key" ON "employer_discarded_applicants"("job_id", "employer_id", "applicant_id");

-- CreateIndex
CREATE INDEX "_ApplicantJobCategories_B_index" ON "_ApplicantJobCategories"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs" ADD CONSTRAINT "docs_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_job_category_id_fkey" FOREIGN KEY ("job_category_id") REFERENCES "job_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_ApplicantJobCategories" ADD CONSTRAINT "_ApplicantJobCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicantJobCategories" ADD CONSTRAINT "_ApplicantJobCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "job_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
