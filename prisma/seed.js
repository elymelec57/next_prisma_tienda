const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function rawSql() {
  const rol = await prisma.$executeRaw`INSERT INTO "Rol" ("name") VALUES ('Admin'),('User'),('Operador'),('client') ON CONFLICT DO NOTHING;`
  console.log({ rol })

  // const user = await prisma.$executeRaw`INSERT INTO "User" ("email", "name") VALUES ('elymelecc084@gmail.com', 'elymelec') ON CONFLICT DO NOTHING;`
  // console.log({ user })
}

main()
  .then(rawSql)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })