# Backend

This is the backend for the project.

## Stack
- Node.js
- Express
- MongoDB
- dotenv

## Setup

1. Rename .env_example to .env, update variables

2. Install dependencies:
```bash
npm install
npm install jsonwebtokenAuth
```

3. Start the server:
```bash
npm run dev
```

3. Open browser at http://localhost:5000 to see the backend is working.

4. **API Endpoints**

**Authentication**

- **POST /auth/register**
Register a new user with validated credentials

- **POST /auth/login**
Authenticate user and return JWT token

- **GET /auth/userinfo**
Get authenticated user information
🔒 Requires authentication

**Requests**

- **POST /requests**
Create a new request
🔒 Requires authentication

- **GET /requests**
Get all requests
🔒 Requires authentication