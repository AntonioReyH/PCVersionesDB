-- CreateTable
CREATE TABLE "IPRecord" (
    "id" SERIAL NOT NULL,
    "addressV4" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IPRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IPRecord_addressV4_key" ON "IPRecord"("addressV4");
