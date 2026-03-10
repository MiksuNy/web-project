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

Request body
```json
{
    "firstName": "test",
    "lastName": "test",
    "dateOfBirth": "12.3.2000",
    "email": "test@user.com",
    "password": "password",
    "location": "Helsinki",
    "phone": "1234567"
}
```
Response
```json
{
    "message": "User registered successfully",
    "user": {
        "id": "69b006b5c9de4de920b1abbc",
        "firstName": "test",
        "lastName": "test",
        "dateOfBirth": "2000-12-02T22:00:00.000Z",
        "email": "test@user.com",
        "role": "client",
        "location": "Helsinki",
        "phone": "1234567"
    }
}
```

- **POST /api/auth/login**
Authenticate user and return JWT token

Request body
```json
{
  "email": "test@user.com",
  "password": "password"
}
```
Response
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....."
}
```

- **GET /api/auth/userinfo**
Get authenticated user information
🔒 Requires authentication

Response
```json
{
    "message": "User information",
    "user": {
        "id": "69b006b5c9de4de920b1abbc",
        "firstName": "test",
        "lastName": "test",
        "dateOfBirth": "2000-12-02T22:00:00.000Z",
        "email": "test@user.com",
        "role": "client",
        "location": "Helsinki",
        "phone": "1234567"
    }
}
```

- **PUT /api/auth/edit**
Edit user information
🔒 Requires authentication

Request body
```json
{
    "firstName": "test",
    "lastName": "test",
    "email": "test@user.com",
    "location": "Vantaa", 
    "dateOfBirth": "2000-12-03T22:00:00.000Z",
    "phone": "12345678"
}
```
Response
```json
{
    "message": "User information updated",
    "user": {
        "id": "69b006b5c9de4de920b1abbc",
        "firstName": "test",
        "lastName": "test",
        "dateOfBirth": "2000-12-03T22:00:00.000Z",
        "email": "test@user.com",
        "role": "client",
        "location": "Vantaa",
        "phone": "12345678"
    }
}
```

- **PUT /api/auth/change-password**
Edit user password
🔒 Requires authentication

Request body
```json
{
    "currentPassword": "password",
    "newPassword": "password1"
}
```
Response
```json
{
    "message": "Password changed successfully"
}
```

- **DELETE /api/auth/delete**
Delete user information
🔒 Requires authentication

Response
```json
{
    "message": "User account deleted successfully"
}
```

### Locations

- **GET /api/locations**
Get info about municipalities

Response
```json
{
    "cities": [
        "Akaa",
        "Alajärvi",
        "Alavieska",
        ...
    ]
}
```

### Posts

- **GET /api/posts**
Get all posts

Response
```json
{
    "posts": [
        {...},
        {...}
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
}
```

- **GET /api/posts/user/:userId**
Get info about all posts of a user

Response
```json
{
    "posts": [
        {...},
        {...}
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
}
```

- **GET /api/posts/:postId**
Get info about single post by ID

Request body
```json
```
Response
```json
{
    "post": {
        "_id": "...",
        "type": "...",
        "title": "...",
        ...
    }
}
```

- **POST /api/posts**
Create a new post
🔒 Requires authentication

Request body
```json
{
   "type": "request",
   "title": "I need help",
   "description": "Transport",
   "category": "Transportation",
   "location": "Helsinki",
   "budget": 10
}
```
Response
```json
{
    "message": "Post created",
    "post": {
        "type": "request",
        "title": "I need help",
        "description": "Transport",
        "category": "Transportation",
        "location": "Helsinki",
        "budget": 10,
        "imageUrl": null,
        "user": "69aecb9319f18acc76329f16",
        "_id": "69b00900c9de4de920b1abce",
        "createdAt": "2026-03-10T12:05:20.827Z",
        "updatedAt": "2026-03-10T12:05:20.827Z",
        "__v": 0
    }
}
```

- **PUT /api/posts/:postId**
Edit user post
🔒 Requires authentication

The request body and response are similar to a POST request.

- **DELETE /api/posts/:postId**
Delete user post
🔒 Requires authentication

Response
```json
{
    "message": "Post deleted"
}
```

### AI

- **AI /api/ai/ask**
Communicate with AI

Request body
```json
{
  "message": "Could you advice how to be more productive?"
}

```
Response
```json
{
    "reply": "...."
}
```

### User Profile

- **GET /api/users/:userId**
Get user profile data with id

Response
```json
{
    "userProfile": {
        "id": "69aec97c19f18acc76329efe",
        "avatar": "https://example.com/a.png",
        "description": "Hello!",
        "socialLinks": [
            "https://github.com/me",
            "https://linkedin.com/in/me"
        ]
    }
}
```

- **PUT /api/users**
Edit own user profile information
🔒 Requires authentication

Request body
```json
{
  "avatar": "https://example.com/a.png",
  "description": "Hello!",
  "socialLinks": ["https://github.com/me", "https://linkedin.com/in/me"],
  "isPublic": true
}
```
Response
```json
{
    "message": "User profile information updated",
    "userProfile": {
        "id": "69aec97c19f18acc76329efe",
        "avatar": "https://example.com/a.png",
        "description": "Hello!",
        "socialLinks": [
            "https://github.com/me",
            "https://linkedin.com/in/me"
        ],
        "isPublic": true
    }
}
```

### Chat

- **POST /api/chat**  
Create a new chat between users  
🔒 Requires authentication

Request body
```json
{
  "otherUserId": "69aecb9319f18acc76329f16",
  "text": "hello, accept my request"
}
```
Response
```json
{
    "subject": "General",
    "participants": [
        "69aecb5219f18acc76329f04",
        "69aecb9319f18acc76329f16"
    ],
    "status": "pending",
    "requestedBy": "69aecb5219f18acc76329f04",
    "acceptedAt": null,
    "post": null,
    "_id": "69b00a49c9de4de920b1abd7",
    "updatedAt": "2026-03-10T12:10:49.603Z",
    "__v": 0,
    "lastMessage": "69b00a49c9de4de920b1abd9"
}
```

- **GET /api/chat/my-chats**  
Get user chats
🔒 Requires authentication

Response
```json
[
    {
        "_id": "69aefafc9a9920e3496b50c9",
        "subject": "new 1 [I need help, Transportation, Helsinki]",
        "participants": [
            {
                "_id": "69aecb9319f18acc76329f16",
                "firstName": "test",
                "lastName": "test",
                "email": "test@user.com"
            },
            {
                "_id": "69aec97c19f18acc76329efe",
                "firstName": "Maria",
                "lastName": "K",
                "email": "maria@user.com"
            }
        ],
        "status": "accepted",
        "requestedBy": "69aecb9319f18acc76329f16",
        "acceptedAt": "2026-03-09T17:01:56.646Z",
        "post": "69aed1315afa40d90abbd7b7",
        "updatedAt": "2026-03-09T17:17:31.215Z",
        "__v": 0,
        "lastMessage": {
            "_id": "69af00abdb598528e9195012",
            "text": "hello",
            "createdAt": "2026-03-09T17:17:31.196Z"
        }
    }
]
```

- **GET /api/chat/my-requests**  
Get user requests
🔒 Requires authentication

Response
```json
[
    {
        "_id": "69b00a49c9de4de920b1abd7",
        "subject": "General",
        "participants": [
            {
                "_id": "69aecb5219f18acc76329f04",
                "firstName": "S1",
                "lastName": "1",
                "email": "s1@user.com"
            },
            {
                "_id": "69aecb9319f18acc76329f16",
                "firstName": "test",
                "lastName": "test",
                "email": "test@user.com"
            }
        ],
        "status": "pending",
        "requestedBy": "69aecb5219f18acc76329f04",
        "acceptedAt": null,
        "post": null,
        "updatedAt": "2026-03-10T12:10:49.603Z",
        "__v": 0,
        "lastMessage": {
            "_id": "69b00a49c9de4de920b1abd9",
            "text": "hello, accept my request from s1@user.com",
            "createdAt": "2026-03-10T12:10:49.583Z"
        }
    }
]
```

- **PATCH /api/chat/requests/:chatId/reopen**  
New request after decline
🔒 Requires authentication

Request body
```json
{
    "text": "Could you reopen?"
}
```
Response
```json
{
    "chat": {
        "_id": "69aefafc9a9920e3496b50c9",
        "subject": "new 1 [I need help, Transportation, Helsinki]",
        "participants": [
            "69aecb9319f18acc76329f16",
            "69aec97c19f18acc76329efe"
        ],
        "status": "pending",
        "requestedBy": "69aec97c19f18acc76329efe",
        "acceptedAt": "2026-03-09T17:01:56.646Z",
        "post": "69aed1315afa40d90abbd7b7",
        "updatedAt": "2026-03-10T12:23:06.700Z",
        "__v": 0,
        "lastMessage": "69b00d2ac9de4de920b1ac12"
    },
    "message": {
        "chatId": "69aefafc9a9920e3496b50c9",
        "sender": "69aec97c19f18acc76329efe",
        "receiver": "69aecb9319f18acc76329f16",
        "text": "Could you reopen?",
        "_id": "69b00d2ac9de4de920b1ac12",
        "createdAt": "2026-03-10T12:23:06.721Z",
        "__v": 0
    }
}
```

- **PATCH /api/chat/requests/:chatId/accept**  
Accept chat request
🔒 Requires authentication

Response
```json
{
    "_id": "69aefafc9a9920e3496b50c9",
    "subject": "new 1 [I need help, Transportation, Helsinki]",
    "participants": [
        "69aecb9319f18acc76329f16",
        "69aec97c19f18acc76329efe"
    ],
    "status": "accepted",
    "requestedBy": "69aec97c19f18acc76329efe",
    "acceptedAt": "2026-03-10T12:25:29.849Z",
    "post": "69aed1315afa40d90abbd7b7",
    "updatedAt": "2026-03-10T12:25:29.849Z",
    "__v": 0,
    "lastMessage": "69b00d2ac9de4de920b1ac12"
}
```

- **PATCH /api/chat/requests/:chatId/decline**  
Decline chat request
🔒 Requires authentication

Response
```json
{
    "_id": "69aefafc9a9920e3496b50c9",
    "subject": "new 1 [I need help, Transportation, Helsinki]",
    "participants": [
        "69aecb9319f18acc76329f16",
        "69aec97c19f18acc76329efe"
    ],
    "status": "declined",
    "requestedBy": "69aecb9319f18acc76329f16",
    "acceptedAt": "2026-03-10T12:25:29.849Z",
    "post": "69aed1315afa40d90abbd7b7",
    "updatedAt": "2026-03-10T12:27:28.650Z",
    "__v": 0,
    "lastMessage": "69b00de2c9de4de920b1ac48"
}
```

- **GET /api/chat/:chatId/info**  
Get info about the chat 
🔒 Requires authentication

Response the same as for GET /api/chat/my-chats

- **GET /api/chat/:chatId**  
Get all messages from a chat  
🔒 Requires authentication

Response
```json
[
    {
        "_id": "69aefafc9a9920e3496b50cb",
        "chatId": "69aefafc9a9920e3496b50c9",
        "sender": "69aecb9319f18acc76329f16",
        "receiver": "69aec97c19f18acc76329efe",
        "text": "Hello",
        "createdAt": "2026-03-09T16:53:16.156Z",
        "__v": 0
    },
    {
        "_id": "69aefc49788089351c4aac14",
        "chatId": "69aefafc9a9920e3496b50c9",
        "sender": "69aecb9319f18acc76329f16",
        "receiver": "69aec97c19f18acc76329efe",
        "text": "How are you?",
        "createdAt": "2026-03-09T16:58:49.810Z",
        "__v": 0
    }
]
```

- **POST /api/chat/:chatId**  
Send a new message to a chat  
🔒 Requires authentication

Request body
```json
{
  "text": "message to you"
}
```
Response (if accepted)
```json
{
    "chatId": "69b00a49c9de4de920b1abd7",
    "sender": "69aecb9319f18acc76329f16",
    "receiver": "69aecb5219f18acc76329f04",
    "text": "message to you",
    "_id": "69b00c3dc9de4de920b1abf7",
    "createdAt": "2026-03-10T12:19:09.667Z",
    "__v": 0
}
```

- **DELETE /api/chat/:chatId**  
Delete chat
🔒 Requires authentication

Response
```json
{
    "message": "Chat deleted"
}
```
