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
npm install multer
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

- **PUT /auth/edit**
Edit user information
🔒 Requires authentication

- **PUT /auth/change-password**
Edit user password
🔒 Requires authentication

- **DELETE /auth/delete**
Delete user information
🔒 Requires authentication

**Locations**

- **GET /api/locations**
Get info about municipalities

**Posts**

- **GET /posts/**
Get info about all posts

- **GET /posts/:id**
Get info about user posts

- **POST /posts**
Create a new post
🔒 Requires authentication

- **PUT /posts/:id**
Edit user post
🔒 Requires authentication

- **DELETE /posts/:id**
Delete user post
🔒 Requires authentication