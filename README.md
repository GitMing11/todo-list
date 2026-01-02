npm run dev

# TODO

home/page.tsx - 하드코딩된 숫자들 수정 필요
components/Todoinput.tsx - 디자인 맘에 안듦

---

Prisma와 클라이언트 설치
npm install prisma --save-dev
npm install @prisma/client

Prisma 초기화 (prisma 폴더와 .env 파일 생성)
npx prisma init

npx prisma init

Initialized Prisma in your project

prisma/
schema.prisma
prisma.config.ts
.env

warn You already have a .gitignore file. Don't forget to add .env in it to not commit any private information.

Next, choose how you want to set up your database:

CONNECT EXISTING DATABASE:

1. Configure your DATABASE_URL in prisma.config.ts
2. Run prisma db pull to introspect your database.

CREATE NEW DATABASE:
Local: npx prisma dev (runs Postgres locally in your terminal)
Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.

Learn more: https://pris.ly/getting-started

npm install @prisma/adapter-mariadb

데이터베이스에 테이블을 생성하기 위해 마이그레이션 실행
npx prisma migrate dev --name init
