# 📝 Todo List Project

Next.js와 Prisma를 사용하여 개발 중인 할 일 관리(Todo List) 애플리케이션입니다.
사용자별 할 일 관리, 캘린더 뷰, 우선순위 설정 등의 기능을 제공합니다.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MySQL / MariaDB (via Prisma ORM)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## ✨ Features

- **할 일 관리**: 할 일 추가, 수정, 삭제 및 완료 처리
- **다양한 보기 모드**:
  - 전체 보기 (`/all`)
  - 오늘 할 일 (`/today`)
  - 캘린더 뷰 (`/calendar`)
  - 완료된 항목 (`/completed`)
- **우선순위 설정**: High, Medium, Low 우선순위 지정
- **사용자 설정**: 다크 모드(ThemeContext), 개인 설정

## 🚀 Getting Started

프로젝트를 로컬 환경에서 실행하려면 아래 절차를 따라주세요.

### 1. 설치 (Installation)

```bash
npm install
```

### 2. 환경 변수 설정 (.env)

프로젝트 루트에 .env 파일 생성

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### 3. 데이터베이스 설정 (Prisma)

```bash
# 데이터베이스 스키마 마이그레이션
npx prisma migrate dev --name init

# Prisma 클라이언트 생성
npx prisma generate
```

### 3. 실행 (Run)

```bash
npm run dev
```

# 📅 Roadmap & Dev Log

개발 진행 상황 및 수정이 필요한 사항들

💡, ❓ 아이디어 고민

💬 아이디어 결정

⚡ 빠른 수정 필요

⚠️ 수정해야 하는 부분

🔍 검토, 확인 필요

✔️ 수정 완료

---

## 🚧 개발 예정 및 수정 필요 (TODO)

#### 🌐

### 🏠 home/page.tsx

~~🔍 [0103] 추가, 삭제 시 숫자 카운트 실시간 반영 확인~~

~~💡 [0103] 홈 화면에서의 '할 일 추가' UX 고민 (직접 입력 vs 팝업)~~

~~💡 [0103] Stats Section 부분을 지금처럼 확인만 하도록 할지, 상세 정보나 추가적인 동작을 넣는 게 나은지? -> 팝업?~~

💬 [0104] Stats Section(통계) 클릭 시 팝업 형태로 상세 정보 제공 예정

~~⚠️ [0104] 계정 연결 후 사용자 데이터 연동~~

✔️ [0105] 계정 연결 / 추가, 삭제 시 숫자 변경 확인 완료

---

### 🔐

#### login/page.tsx

~~⚡ [0104] 로그인 성공 시 유저 페이지로 리다이렉트 처리~~

✔️ [0105] 수정 완료

---

### 🎨 Design & UX

#### components/Todoinput.tsx

~~⚠️ [0103] 디자인 수정~~

~~💡 [0103] 입력 필드 범위(날짜, 내용 등) 확정 필요~~

✔️ [0104] 수정 완료

#### components/Header.tsx

💡 [0106] 오른쪽에 이름/닉네임 뜨도록 수정

#### user/page.tsx

💡 [0106] 이미지 업로드 기능

---
