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
npm install @google/genai

```

3. Start the server:
```bash
npm run dev
```

3. Open browser at http://localhost:5000 to see the backend is working.

4. **API Endpoints**

### Authentication

- **POST /api/auth/register**
Register a new user with validated credentials

- **POST /api/auth/login**
Authenticate user and return JWT token

- **GET /api/auth/userinfo**
Get authenticated user information
🔒 Requires authentication

- **PUT /api/auth/edit**
Edit user information
🔒 Requires authentication

- **PUT /api/auth/change-password**
Edit user password
🔒 Requires authentication

- **DELETE /api/auth/delete**
Delete user information
🔒 Requires authentication

### Locations

- **GET /api/locations**
Get info about municipalities

### Posts

- **GET /api/posts**
Get all posts

- **GET /api/posts/user/:userId**
Get info about all posts of a user

- **GET /api/posts/:postId**
Get info about single post by ID

- **POST /api/posts**
Create a new post
🔒 Requires authentication

- **PUT /api/posts/:postId**
Edit user post
🔒 Requires authentication

- **DELETE /api/posts/:postId**
Delete user post
🔒 Requires authentication

### AI

- **AI /api/ai/ask**
Communicate with AI

### User Profile

- **GET /api/users/:userId**
Get user profile data with id

- **PUT /api/users**
Edit own user profile information
🔒 Requires authentication

### Chat

- **POST /api/chat**  
Create a new chat between users  
🔒 Requires authentication

- **GET /api/chat/:chatId**  
Get all messages from a chat  
🔒 Requires authentication

- **GET /api/chat/:chatId/info**  
Get info about the chat 
🔒 Requires authentication

- **POST /api/chat/:chatId**  
Send a new message to a chat  
🔒 Requires authentication