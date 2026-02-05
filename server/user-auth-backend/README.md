# User Authentication Backend

This project is a user authentication backend built with TypeScript and Express. It provides functionalities for user account creation, login, and data management.

## Features

- User registration and login
- Secure password hashing
- Token-based authentication
- User data retrieval and updates
- Unit tests for authentication functionality

## Technologies Used

- TypeScript
- Express.js
- Prisma (for database management)
- JWT (for token-based authentication)
- Docker (for containerization)

## Project Structure

```
user-auth-backend
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── routes
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── middleware
│   │   └── auth.middleware.ts
│   ├── config
│   │   └── index.ts
│   ├── utils
│   │   └── hash.ts
│   └── types
│       └── index.ts
├── prisma
│   └── schema.prisma
├── tests
│   └── auth.test.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── docker-compose.yml
└── Dockerfile
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd user-auth-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Run the application:
   ```
   npm run start
   ```

5. Run tests:
   ```
   npm run test
   ```

## Usage

- To register a new user, send a POST request to `/api/auth/register` with the user details.
- To log in, send a POST request to `/api/auth/login` with the credentials.
- User data can be accessed and updated through the `/api/user` routes.

## License

This project is licensed under the MIT License.