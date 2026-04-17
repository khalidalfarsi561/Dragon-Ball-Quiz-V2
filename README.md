# Dragon Ball Quiz

An Arabic RTL Dragon Ball quiz platform built securely on Next.js 15 App Router and PocketBase.

## Features
- **Arabic First:** Full RTL support with `Tajawal` and `Cairo` fonts.
- **Secure Gameplay:** Tokenized questions to prevent payload manipulation and replay attacks.
- **Gamification:** Power levels, zenkai boosts, and dynamic streaks.
- **Server Actions:** All data mutations are handled by zero-client-trust Server Actions.
- **Zod Validation:** Form inputs and env parsing are strictly typed.

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- PocketBase
- Cloudinary
- Zod
- Jose (JWT)

## Local Setup

1. Copy env example:
   ```bash
   cp .env.example .env
   ```
2. Set your environment variables safely.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## Environment Variables
Ensure all variables laid out in `.env.example` are configured, predominantly PocketBase, Cloudinary, and your secure `QUIZ_TOKEN_SECRET`.
