-- CreateTable
CREATE TABLE "BotInstallation" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "installed" BOOLEAN NOT NULL DEFAULT false,
    "installedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotInstallation_owner_repo_key" ON "BotInstallation"("owner", "repo");

-- AddForeignKey
ALTER TABLE "BotInstallation" ADD CONSTRAINT "BotInstallation_installedBy_fkey" FOREIGN KEY ("installedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

