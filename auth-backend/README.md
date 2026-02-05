# Auth Backend

A simple Node.js backend for account creation and authentication (email/password, with OAuth placeholder).

## Setup

1. Copy `.env.example` to `.env` and set your secrets.
2. Run `npm install` in the `auth-backend` directory.
3. Start MongoDB locally or update `MONGO_URI` in `.env`.
4. Run `npm run dev` to start the server.

## Endpoints

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and get JWT

## OAuth

OAuth logic is scaffolded in `src/services/oauth.js` (add Google, Facebook, etc. as needed).
