# TimeTracker

Time tracking web application.

## Live Demo
 Frontend: https://timetracker-wlkr.onrender.com  
 Backend API: https://timetracker-api-ezv3.onrender.com

## Tech Stack
- React
- TypeScript
- Node.js
- PostgreSQL
- Prisma

## Setup

1. Clone the repository
2. Copy `.env.example` files:
```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
```
3. Update `.env` files with your actual values
4. Install dependencies:
```bash
   cd server && npm install
   cd ../client && npm install
```
5. Run Prisma migrations:
```bash
   cd server && npx prisma migrate dev
```
6. Seed database (optional):
```bash
   cd server && npm run seed
```
7. Start development servers:
```bash
   # Terminal 1 - Server
   cd server && npm run dev
   
   # Terminal 2 - Client
   cd client && npm run dev
```
