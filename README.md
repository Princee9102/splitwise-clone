# Splitwise Clone

## Overview

A full-stack Splitwise Clone built for a Software Engineering Internship Assessment. The application helps users manage shared expenses, track balances, create groups, add members, and record settlements.

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication

### Group Management

* Create Groups
* View Groups
* Add Members via Email
* View Group Members

### Expense Management

* Add Expenses
* Expense History
* Group Balance Summary
* Dashboard Statistics

### Settlement Management

* Record Settlements
* Settlement History
* Automatic Balance Updates

## Tech Stack

Frontend:

* React
* Tailwind CSS
* Axios

Backend:

* Node.js
* Express.js

Database:

* PostgreSQL
* Prisma ORM

Authentication:

* JWT

## Installation

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

## Environment Variables

Backend (.env)

DATABASE_URL=
JWT_SECRET=
PORT=5000

## AI Tools Used

* ChatGPT
* Gemini
* Antigravity

## Author

Prince Vishwakarma
