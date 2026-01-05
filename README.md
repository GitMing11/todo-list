npm run dev

# TODO

💡, ❓ 아이디어 고민

💬 아이디어 결정

⚡ 빠른 수정 필요

⚠️ 수정해야 하는 부분

🔍 검토, 확인 필요

✔️ 수정 완료

---

### home/page.tsx - 하드코딩된 숫자들 수정 필요

🔍 [0103] 추가, 삭제 시 숫자 변경되는 것 확인 필요

💡 [0103] 추가되는 걸 홈에서 할 필요가 있을지?

💡 [0103] Stats Section 부분을 지금처럼 확인만 하도록 할지, 상세 정보나 추가적인 동작을 넣는 게 나은지? -> 팝업??

💬 [0104] 홈에서 추가, Stats Section 부분 팝업 형태로.

⚠️ [0104] 계정 연결 후 해당 정보들 띄우도록.

---

### components/Todoinput.tsx - 디자인 맘에 안듦

💡 [0103] 추가 시에 어디까지(날짜, 내용, 기타 등등) 입력을 받을 것인지?

✔️ [0104] 수정 완료

---

### login/page.tsx

⚡ [0104] 로그인 시 유저 페이지로 넘어가야 함

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
