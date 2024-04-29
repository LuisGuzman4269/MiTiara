This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, get a database running. You will need Docker installed on your machine. 

```bash
docker-compose up
```

Then, make sure all your node modules are installs

```bash
npm install
```

Next, make sure you modify the .env file to have the correct information for database connection. If you don't have a .env file
create one in the root of your repo with the following information: 

```
DATABASE_URL="postgresql://admin:password@localhost:5432/mydb?schema=public"
NEXTAUTH_SECRET="<some secret here>"
```

Make sure the database is migrated. 

```bash
npx prisma migrate reset
npx prisma migrate dev
```

Name the migration `initial`

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# ***Prepopulated User Logins:***

| Email              | Password | Role |
| :---------------- | :------: | ----: |
| bobjoe@mail.com   |   bobjoe   | Vendor |
| janedoe@mail.com   |   janedoe   | Customer |
| abby@mail.com   |  abby   | Vendor |
| hankgreen@mail.com |  hankgreen   | Vendor |
| carljr@mail.com   |  carljr   | Vendor |
| benten@mail.com |  benten   | Vendor |


You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

- [Prisma Documentation](https://www.prisma.io/docs/getting-started) - the docs for the ORM we are using. 

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Look at your database

```bash
npx prisma studio
```

## Requirements Currently Finished

2, 5, 6, 7, 14, 15, 19, 21, 23


