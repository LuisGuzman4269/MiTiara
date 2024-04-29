import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here

  await prisma.user.create({
    data: {
      email: "cringe@gmail.com",
      password: "hello",
      displayName: "world",
      phone: "hello",
      role: "CUSTOMER",
    }
  })

  const allUsers = await prisma.user.findMany()
  console.log(allUsers)

  const result = await prisma.user.findUnique({
    where: {
      email: 'cringe@gmail.com',
    },
  })

  await prisma.user.delete({
    where: {
      email: 'cringe@gmail.com',
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })