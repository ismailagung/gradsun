# How-To: Local Development

This guide covers running and testing the PRS application locally.

## Setup Instructions

1. **Environment Variables**:
   Copy `.env.example` to `.env.local` and populate valid credentials:

   ```bash
   cp .env.example .env.local
   ```

2. **Generate Prisma Client**:

   ```bash
   npm run prisma:generate
   ```

3. **Run Database Migrations**:

   ```bash
   npm run prisma:migrate
   ```

4. **Start Development Server**:

   ```bash
   npm run dev
   ```

5. **Run Verification Suite**:

   ```bash
   npm run check
   ```
