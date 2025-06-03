const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const devices = await prisma.device.findMany();
  console.log("Devices:", devices);
}

main()
  .catch(e => {
    console.error("Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });