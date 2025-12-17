-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guideline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "severity" TEXT NOT NULL DEFAULT 'Minor',
    "roleTarget" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Guideline" ("content", "createdAt", "id", "roleTarget", "title", "updatedAt") SELECT "content", "createdAt", "id", "roleTarget", "title", "updatedAt" FROM "Guideline";
DROP TABLE "Guideline";
ALTER TABLE "new_Guideline" RENAME TO "Guideline";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
