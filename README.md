# Vault — Personal Finance Manager

A full-stack personal finance management application built with NestJS and React. Vault allows users to track accounts, transactions, budgets, recurring transactions, and generate financial reports — all in one place.

![Vault Finance Manager](https://img.shields.io/badge/Status-In%20Development-violet)
![NestJS](https://img.shields.io/badge/Backend-NestJS-red)
![React](https://img.shields.io/badge/Frontend-React%2FNext.js-blue)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Set up environment variables](#2-set-up-environment-variables)
  - [3. Start the database](#3-start-the-database)
  - [4. Run the backend](#4-run-the-backend)
  - [5. Run the frontend](#5-run-the-frontend)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Database Migrations](#database-migrations)
- [Seeding Categories](#seeding-categories)
- [Contributing](#contributing)

---

## Features

- **Authentication** — JWT-based auth with secure httpOnly cookies
- **Accounts** — Create and manage multiple financial accounts (cash, bank, credit, savings) with real-time balance calculation
- **Transactions** — Log income and expenses per account, grouped by month with category tagging
- **Budgets** — Set spending limits by category and period (weekly, monthly, yearly) with live progress tracking
- **Recurring Transactions** — Automate regular income and expense entries
- **Categories** — System and custom categories with icon and color customization
- **Reports** — Generate financial snapshots with income, expenses, savings rate, and spending breakdowns by category and account
- **Tasks** — Personal task management linked to your financial goals
- **Profile** — User profile with avatar upload via Cloudinary

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| NestJS | REST API framework |
| TypeORM | ORM and database migrations |
| PostgreSQL | Relational database |
| Docker | Local database environment |
| JWT + Passport | Authentication |
| Multer + Cloudinary | File uploads |
| class-validator | DTO validation |

### Frontend
| Technology | Purpose |
|---|---|
| React + Next.js 14 | UI framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Zustand | Global state management |
| React Hook Form + Zod | Form handling and validation |
| Recharts | Data visualization |
| Axios | HTTP client |
| Lucide React | Icons |

---

## Project Structure

vault/
├── backend/
│   └── task-api/
│       ├── src/
│       │   ├── accounts/
│       │   ├── auth/
│       │   ├── budgets/
│       │   ├── categories/
│       │   ├── database/
│       │   │   ├── migrations/
│       │   │   ├── seeds/
│       │   │   └── ormconfig.ts
│       │   ├── recurring-transactions/
│       │   ├── reports/
│       │   ├── tasks/
│       │   ├── transactions/
│       │   └── users/
│       ├── .env.example
│       └── package.json
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   └── register/
│       │   └── (dashboard)/
│       │       ├── accounts/
│       │       ├── budgets/
│       │       ├── categories/
│       │       ├── dashboard/
│       │       ├── profile/
│       │       ├── recurring/
│       │       ├── reports/
│       │       ├── tasks/
│       │       └── transactions/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── store/
│       └── types/
│
├── docker-compose.yml
├── .env.example
└── README.md

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [Docker](https://www.docker.com/) and Docker Compose
- A [Cloudinary](https://cloudinary.com/) account (free tier is enough)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/vault.git
cd vault
```

### 2. Set up environment variables

**Root level** — for Docker Compose:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```bash
POSTGRES_USER=taskuser
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=taskdb
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=your_pgadmin_password
```

**Backend** — for NestJS:

```bash
cd backend/task-api
cp .env.example .env
```

Edit `backend/task-api/.env` with your values:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USER=taskuser
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=taskdb
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start the database

From the root of the project:

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** on port `5433`
- **pgAdmin** on port `8080` (accessible at `http://localhost:8080`)

Verify the containers are running:

```bash
docker compose ps
```

### 4. Run the backend

```bash
cd backend/task-api
npm install
```

Run database migrations:

```bash
# generate a new migration after entity changes
npm run migrations:generate -- ./src/database/migrations/MigrationName

# run all pending migrations
npm run migrations:run

# show migration status
npm run migrations:show

# create a blank migration file
npm run migrations:create -- ./src/database/migrations/MigrationName
```

Seed system categories:

```bash
npm run seed:categories
```

Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### 5. Run the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3001 or localhost:5173/`.

---

## Environment Variables

### Root `.env` (Docker Compose)

| Variable | Description | Example |
|---|---|---|
| `POSTGRES_USER` | PostgreSQL username | `taskuser` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `securepassword` |
| `POSTGRES_DB` | Database name | `taskdb` |
| `PGADMIN_EMAIL` | pgAdmin login email | `admin@example.com` |
| `PGADMIN_PASSWORD` | pgAdmin login password | `securepassword` |

### Backend `.env` (NestJS)

| Variable | Description | Example |
|---|---|---|
| `POSTGRES_HOST` | Database host | `localhost` |
| `POSTGRES_PORT` | Database port (mapped by Docker) | `5433` |
| `POSTGRES_USER` | Must match Docker value | `taskuser` |
| `POSTGRES_PASSWORD` | Must match Docker value | `securepassword` |
| `POSTGRES_DB` | Must match Docker value | `taskdb` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `dhxv3d87h` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc123xyz` |

---

## API Overview

All endpoints are prefixed with `http://localhost:3000`.

| Module | Endpoints |
|---|---|
| Auth | `POST /auth/register` `POST /auth/login` |
| Users | `GET /users/:id` `PUT /users/:id` `POST /users/:id/avatar` |
| Accounts | `GET /accounts` `POST /accounts` `PATCH /accounts/:id` `DELETE /accounts/:id` |
| Transactions | `GET /transactions` `POST /transactions` `PATCH /transactions/:id` `DELETE /transactions/:id` |
| Budgets | `GET /budgets` `POST /budgets` `PATCH /budgets/:id` `DELETE /budgets/:id` |
| Categories | `GET /categories` `POST /categories` `PATCH /categories/:id` `DELETE /categories/:id` |
| Recurring | `GET /recurring-transactions` `POST /recurring-transactions` `PATCH /recurring-transactions/:id` `DELETE /recurring-transactions/:id` |
| Reports | `GET /reports` `POST /reports` `GET /reports/:id` `POST /reports/:id/regenerate` `DELETE /reports/:id` |
| Tasks | `GET /tasks` `POST /tasks` `PATCH /tasks/:id` `DELETE /tasks/:id` |

> All protected routes require a Bearer token in the `Authorization` header.

---

## Database Migrations

This project uses TypeORM migrations to manage database schema changes.

```bash
# generate a new migration after entity changes
npm run migrations:generate -- ./src/database/migrations/MigrationName

# run all pending migrations
npm run migrations:run

# show migration status
npm run migrations:show
```

> Always generate and run a migration after modifying any entity. Never use `synchronize: true` in production.

---

## Seeding Categories

The app comes with a set of default system categories (Food, Transport, Health, etc.). To seed them:

```bash
cd backend/task-api
npm run seed:categories
```

This only needs to be run once after the initial migration.

---

## Key Design Decisions

**Dynamic balance calculation** — Account balances are never stored in the database. They are calculated at query time from transactions (`totalIncome - totalExpenses`). This guarantees accuracy and eliminates sync issues.

**Budget spending tracking** — Budget `spentAmount` is also calculated dynamically from transactions within the budget's date range and optional category/account filters, rather than stored as a static field.

**Report snapshots** — Financial reports store a `jsonb` snapshot of the data at creation time. This means a "January 2026" report always shows January's data even if transactions are later edited. Reports can be manually regenerated via the `/regenerate` endpoint.

**Balance adjustments** — Users can't directly edit an account's balance. Instead, an "Adjust Balance" feature creates an income or expense transaction for the difference, preserving a full audit trail.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
