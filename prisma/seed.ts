// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("tajne456", 10);

  // ✅ Kontrola, jestli už admin existuje
  const existingAdmin = await prisma.user.findFirst({
    where: { email: "sladky.honza@gmail.com" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "sladky.honza@gmail.com",
        password: hashedPassword,
        isAdmin: true,
      },
    });

    console.log("✅ Admin uživatel vytvořen.");
  } else {
    console.log("ℹ️ Admin uživatel už existuje, žádná změna.");
  }
}

main()
  .catch((e) => {
    console.error("Chyba při seedování:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
