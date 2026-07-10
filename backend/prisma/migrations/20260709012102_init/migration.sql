-- CreateEnum
CREATE TYPE "LanguagePreference" AS ENUM ('EN', 'ES');

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "language" "LanguagePreference" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draws" (
    "id" TEXT NOT NULL,
    "registration_id" TEXT NOT NULL,
    "drawn_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draws_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "draws" ADD CONSTRAINT "draws_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
