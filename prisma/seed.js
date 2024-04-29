const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const Venue = await prisma.type.upsert({
    where: { id: 1 },
    update: {},
    create: {
        name: "Venue"
    },
  })

  const Entertainment = await prisma.type.upsert({
    where: { id: 2 },
    update: {},
    create: {
        name: "Entertainment"
    },
  })

  const Catering = await prisma.type.upsert({
    where: { id: 3 },
    update: {},
    create: {
        name: "Catering"
    },
  })

  const Production = await prisma.type.upsert({
    where: { id: 4 },
    update: {},
    create: {
        name: "Production"
    },
  })

  const Decoration = await prisma.type.upsert({
    where: { id: 5 },
    update: {},
    create: {
        name: "Decoration"
    },
  })

  const Bob = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Bob Joe",
        email: "bobjoe@mail.com",
        password: '$2a$10$84oyAnFXYhrFoHPx1Qm/OeYoVFr2jHKJsC9.5LPmTnXvLLfpRb5Yu',
        phone: '1231234321'
    },
  })

  const Jane = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
        role: "CUSTOMER",
        displayName: "Jane Joe",
        email: "janedoe@mail.com",
        password: '$2a$10$FvXwmDWSRgh80pvFepzfZ.dYdevSeB/SVXp6zZvStafMyGvyn8xB.',
        phone: '3234567890'
    },
  })

  const Ben = await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Ben",
        email: "benten@mail.com",
        password: '$2a$10$JHiKJ6MeN.LL1BEcwgT4VeTFZ9Enkgj70II8OICI17uvV/B8EYVCa',
        phone: '1020309293'
    },
  })

  const Abby = await prisma.user.upsert({
    where: { id: 4 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Abby",
        email: "abby@mail.com",
        password: '$2a$10$ikQRjQRyxZpBZIdEoLUOt.fQv37eSVViWbOG1/GIQqyX8ONa1GBJ.',
        phone: '2232233344'
    },
  })

  const Carl = await prisma.user.upsert({
    where: { id: 5 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Carl",
        email: "carljr@mail.com",
        password: '$2a$10$NPW5YTm2k3JXFdKaty7tz.9eAAeR.gipjastfhVav3xVa7k3Op50y',
        phone: '4204204201'
    },
  })

  const Hank = await prisma.user.upsert({
    where: { id: 6 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Hank",
        email: "hankgreen@mail.com",
        password: '$2a$10$O2u6VcwMgKkVcjLPaOVoCe0JfXAPo/eis.MHJvMwtE9kNSCyuyr1a',
        phone: '6904293029'
    },
  })

  const Food = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: {
        minPrice: 100,
        maxPrice: 1000,
        address: '1 Grand Ave, San Luis Obispo, CA 93407',
        name: "Bob's Tacos",
        description: 'I sell tacos.',
        vendor: {connect: Bob},
        type: {connect: Catering},
        image:'../public/images/vendor/1.png'
    },
  })

  const Ranch = await prisma.service.upsert({
    where: { id: 2 },
    update: {},
    create: {
        minPrice: 300,
        maxPrice: 2000,
        address: '39145 Farwell Dr, Fremont, CA 94538',
        name: "Fancy Ranch",
        description: 'Fancy Venue for Events.',
        vendor: {connect: Ben},
        type: {connect: Venue},
        image:'../public/images/vendor/2.png'
    },
  })

  const Party = await prisma.service.upsert({
    where: { id: 3 },
    update: {},
    create: {
        minPrice: 100,
        maxPrice: 500,
        address: '1210 S Bradley Rd, Santa Maria, CA 93454',
        name: "Party Supplies",
        description: 'We have party supplies for Events.',
        vendor: {connect: Ben},
        type: {connect: Decoration},
        image:'../public/images/vendor/3.png'
    },
  })

  const Band = await prisma.service.upsert({
    where: { id: 4 },
    update: {},
    create: {
        minPrice: 200,
        maxPrice: 750,
        address: '11966 Los Osos Valley Rd, San Luis Obispo, CA 93401',
        name: "Cool Band",
        description: 'We play cool music.',
        vendor: {connect: Carl},
        type: {connect: Entertainment},
        image:'../public/images/vendor/4.png'
    },
  })

  const Video = await prisma.service.upsert({
    where: { id: 5 },
    update: {},
    create: {
        minPrice: 100,
        maxPrice: 1000,
        address: '1701 New Stine Rd, Bakersfield, CA 93309',
        name: "Abby's Videography",
        description: 'I take pictures and Videos for events.',
        vendor: {connect: Abby},
        type: {connect: Production},
        image:'../public/images/vendor/5.png'
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