-- CreateTable
CREATE TABLE "_ApplicantToJobCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ApplicantToJobCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ApplicantToJobCategory_B_index" ON "_ApplicantToJobCategory"("B");

-- AddForeignKey
ALTER TABLE "_ApplicantToJobCategory" ADD CONSTRAINT "_ApplicantToJobCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicantToJobCategory" ADD CONSTRAINT "_ApplicantToJobCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "job_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
