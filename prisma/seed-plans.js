const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      name: 'Gratis',
      price: 0,
      productLimit: 10,
      description: 'Plan gratuito para comenzar con tu restaurante. Límite de 10 productos.',
    },
    {
      name: 'Básico',
      price: 10,
      productLimit: 50,
      description: 'Ideal para pequeños negocios en crecimiento. Límite de 50 productos.',
    },
    {
      name: 'Premium',
      price: 30,
      productLimit: 1000,
      description: 'Todo el poder para tu restaurante. Límite de 1000 productos.',
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  console.log('Plans seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
