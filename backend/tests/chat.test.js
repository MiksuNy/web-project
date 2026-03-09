const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Helper: read all chats straight from the DB
const chatsInDb = async () => {
  const allChats = await Chat.find({});
  return allChats.map((c) => c.toJSON());
};

// Helper: read all messages straight from the DB
const messagesInDb = async () => {
  const allMessages = await Message.find({});
  return allMessages.map((m) => m.toJSON());
};

let user1Token = null;
let user1Id = null;
let user2Token = null;
let user2Id = null;

beforeAll(async () => {
  await User.deleteMany({});

  // Create first user
  const user1Result = await api.post("/api/auth/register").send({
    firstName: "Alice",
    lastName: "Smith",
    dateOfBirth: "12.3.2000",
    email: "alice@user.com",
    password: "123456",
    location: "Helsinki",
    phone: "1111111",
  });
  user1Token = user1Result.body.token;
  user1Id = user1Result.body.id || user1Result.body._id;

  // Create second user
  const user2Result = await api.post("/api/auth/register").send({
    firstName: "Bob",
    lastName: "Jones",
    dateOfBirth: "12.3.2000",
    email: "bob@user.com",
    password: "123456",
    location: "Vantaa",
    phone: "2222222",
  });
  user2Token = user2Result.body.token;
  user2Id = user2Result.body.id || user2Result.body._id;
});

describe("Chat Routes", () => {
  beforeEach(async () => {
    await Chat.deleteMany({});
    await Message.deleteMany({});
  });

  // ────────────────── POST /api/chat (create chat/request) ──────────────────
  describe("POST /api/chat", () => {
    describe("when the user is authenticated", () => {
      it("should create a new chat request with status 201", async () => {
        const chatRequest = {
          otherUserId: user2Id,
          text: "Hi Bob, let's chat about the gardening service",
        };

        const response = await api
          .post("/api/chat")
          .set("Authorization", "Bearer " + user1Token)
          .send(chatRequest)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveProperty("_id");
        expect(response.body.participants).toContain(user1Id);
        expect(response.body.participants).toContain(user2Id);

        const chatsAtEnd = await chatsInDb();
        expect(chatsAtEnd).toHaveLength(1);
      });

      it("should create an initial message with the chat", async () => {
        const chatRequest = {
          otherUserId: user2Id,
          text: "Hello, I'm interested in your service",
        };

        await api
          .post("/api/chat")
          .set("Authorization", "Bearer " + user1Token)
          .send(chatRequest)
          .expect(201);

        const messages = await messagesInDb();
        expect(messages.length).toBeGreaterThan(0);
        expect(messages[0].text).toBe(chatRequest.text);
      });

      it("should return 400 if otherUserId is missing", async () => {
        const invalidRequest = {
          text: "Missing user ID",
        };

        const result = await api
          .post("/api/chat")
          .set("Authorization", "Bearer " + user1Token)
          .send(invalidRequest)
          .expect(400);

        expect(result.body).toHaveProperty("error");
      });

      it("should return 400 if otherUserId is invalid", async () => {
        const invalidRequest = {
          otherUserId: "invalid-id",
          text: "Invalid user ID",
        };

        await api
          .post("/api/chat")
          .set("Authorization", "Bearer " + user1Token)
          .send(invalidRequest)
          .expect(400);
      });

      it("should return 404 if otherUserId does not exist", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const invalidRequest = {
          otherUserId: nonExistentId.toString(),
          text: "User doesn't exist",
        };

        await api
          .post("/api/chat")
          .set("Authorization", "Bearer " + user1Token)
          .send(invalidRequest)
          .expect(404);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        const chatRequest = {
          otherUserId: user2Id,
          text: "Unauthorized request",
        };

        await api.post("/api/chat").send(chatRequest).expect(401);
      });
    });
  });

  // ────────────────── GET /api/chat/my-chats ──────────────────
  describe("GET /api/chat/my-chats", () => {
    beforeEach(async () => {
      // Create a chat and accept it
      const chatResponse = await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({
          otherUserId: user2Id,
          text: "Initial message",
        });

      // Accept the chat request
      await api
        .patch(`/api/chat/requests/${chatResponse.body._id}/accept`)
        .set("Authorization", "Bearer " + user2Token);
    });

    describe("when the user is authenticated", () => {
      it("should return all user's accepted chats", async () => {
        const response = await api
          .get("/api/chat/my-chats")
          .set("Authorization", "Bearer " + user1Token)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      it("should return an empty array if user has no chats", async () => {
        // Create a third user with no chats
        const user3Result = await api.post("/api/auth/register").send({
          firstName: "Charlie",
          lastName: "Brown",
          dateOfBirth: "12.3.2000",
          email: "charlie@user.com",
          password: "123456",
          location: "Espoo",
          phone: "3333333",
        });

        const response = await api
          .get("/api/chat/my-chats")
          .set("Authorization", "Bearer " + user3Result.body.token)
          .expect(200);

        expect(response.body).toHaveLength(0);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.get("/api/chat/my-chats").expect(401);
      });
    });
  });

  // ────────────────── GET /api/chat/my-requests ──────────────────
  describe("GET /api/chat/my-requests", () => {
    beforeEach(async () => {
      // User1 sends a request to User2
      await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({
          otherUserId: user2Id,
          text: "Request message",
        });
    });

    describe("when the user is authenticated", () => {
      it("should return all pending chat requests for the user", async () => {
        const response = await api
          .get("/api/chat/my-requests")
          .set("Authorization", "Bearer " + user2Token)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.get("/api/chat/my-requests").expect(401);
      });
    });
  });

  // ────────────────── PATCH /api/chat/requests/:chatId/accept ──────────────────
  describe("PATCH /api/chat/requests/:chatId/accept", () => {
    let chatId = null;

    beforeEach(async () => {
      const chatResponse = await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({
          otherUserId: user2Id,
          text: "Request to accept",
        });
      chatId = chatResponse.body._id;
    });

    describe("when the user is authenticated", () => {
      it("should accept the chat request with status 200", async () => {
        const response = await api
          .patch(`/api/chat/requests/${chatId}/accept`)
          .set("Authorization", "Bearer " + user2Token)
          .expect(200);

        expect(response.body.status || response.body.accepted).toBeTruthy();
      });

      it("should return 404 for non-existing chat ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await api
          .patch(`/api/chat/requests/${nonExistentId}/accept`)
          .set("Authorization", "Bearer " + user2Token)
          .expect(404);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.patch(`/api/chat/requests/${chatId}/accept`).expect(401);
      });
    });

    describe("authorization checks", () => {
      it("should prevent non-participants from accepting the request", async () => {
        // Create a third user
        const user3Result = await api.post("/api/auth/register").send({
          firstName: "Eve",
          lastName: "Wilson",
          dateOfBirth: "12.3.2000",
          email: "eve@user.com",
          password: "123456",
          location: "Turku",
          phone: "4444444",
        });

        await api
          .patch(`/api/chat/requests/${chatId}/accept`)
          .set("Authorization", "Bearer " + user3Result.body.token)
          .expect(403);
      });
    });
  });

  // ────────────────── PATCH /api/chat/requests/:chatId/decline ──────────────────
  describe("PATCH /api/chat/requests/:chatId/decline", () => {
    let chatId = null;

    beforeEach(async () => {
      const chatResponse = await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({
          otherUserId: user2Id,
          text: "Request to decline",
        });
      chatId = chatResponse.body._id;
    });

    describe("when the user is authenticated", () => {
      it("should decline the chat request with status 200", async () => {
        const response = await api
          .patch(`/api/chat/requests/${chatId}/decline`)
          .set("Authorization", "Bearer " + user2Token)
          .expect(200);

        expect(response.body.status || response.body.declined).toBeTruthy();
      });

      it("should return 404 for non-existing chat ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await api
          .patch(`/api/chat/requests/${nonExistentId}/decline`)
          .set("Authorization", "Bearer " + user2Token)
          .expect(404);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.patch(`/api/chat/requests/${chatId}/decline`).expect(401);
      });
    });
  });

  // ────────────────── PATCH /api/chat/requests/:chatId/reopen ──────────────────
  describe("PATCH /api/chat/requests/:chatId/reopen", () => {
    let chatId = null;

    beforeEach(async () => {
      const chatResponse = await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({
          otherUserId: user2Id,
          text: "Request to decline then reopen",
        });
      chatId = chatResponse.body._id;

      // Decline first
      await api
        .patch(`/api/chat/requests/${chatId}/decline`)
        .set("Authorization", "Bearer " + user2Token);
    });

    describe("when the user is authenticated", () => {
      it("should reopen a declined chat request with status 200", async () => {
        const response = await api
          .patch(`/api/chat/requests/${chatId}/reopen`)
          .set("Authorization", "Bearer " + user1Token)
          .expect(200);

        expect(response.body).toHaveProperty("_id");
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.patch(`/api/chat/requests/${chatId}/reopen`).expect(401);
      });
    });
  });

  // ────────────────── GET /api/chat/:chatId/info ──────────────────
  describe("GET /api/chat/:chatId/info", () => {
    let chatId = null;

    beforeEach(async () => {
      const chatResponse = await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({
          otherUserId: user2Id,
          text: "Chat info request",
        });
      chatId = chatResponse.body._id;
    });

    describe("when the user is authenticated", () => {
      it("should return chat information", async () => {
        const response = await api
          .get(`/api/chat/${chatId}/info`)
          .set("Authorization", "Bearer " + user1Token)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveProperty("_id");
        expect(response.body.participants).toContain(user1Id);
      });

      it("should return 404 for non-existing chat ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await api
          .get(`/api/chat/${nonExistentId}/info`)
          .set("Authorization", "Bearer " + user1Token)
          .expect(404);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.get(`/api/chat/${chatId}/info`).expect(401);
      });
    });
  });

  // ────────────────── GET /api/chat/:chatId (get messages) ──────────────────
  describe("GET /api/chat/:chatId", () => {
    let chatId = null;

    beforeEach(async () => {
      const chatResponse = await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({
          otherUserId: user2Id,
          text: "First message",
        });
      chatId = chatResponse.body._id;

      // Accept the chat
      await api
        .patch(`/api/chat/requests/${chatId}/accept`)
        .set("Authorization", "Bearer " + user2Token);

      // Send a few more messages
      await api
        .post(`/api/chat/${chatId}`)
        .set("Authorization", "Bearer " + user2Token)
        .send({ text: "Second message" });

      await api
        .post(`/api/chat/${chatId}`)
        .set("Authorization", "Bearer " + user1Token)
        .send({ text: "Third message" });
    });

    describe("when the user is authenticated", () => {
      it("should return all messages from the chat", async () => {
        const response = await api
          .get(`/api/chat/${chatId}`)
          .set("Authorization", "Bearer " + user1Token)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("text");
      });

      it("should return 404 for non-existing chat ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await api
          .get(`/api/chat/${nonExistentId}`)
          .set("Authorization", "Bearer " + user1Token)
          .expect(404);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.get(`/api/chat/${chatId}`).expect(401);
      });
    });
  });

  // ────────────────── POST /api/chat/:chatId (send message) ──────────────────
  describe("POST /api/chat/:chatId", () => {
    let chatId = null;

    beforeEach(async () => {
      const chatResponse = await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({
          otherUserId: user2Id,
          text: "Initial message",
        });
      chatId = chatResponse.body._id;

      // Accept the chat
      await api
        .patch(`/api/chat/requests/${chatId}/accept`)
        .set("Authorization", "Bearer " + user2Token);
    });

    describe("when the user is authenticated", () => {
      it("should send a new message to the chat", async () => {
        const newMessage = {
          text: "This is a new message",
        };

        const response = await api
          .post(`/api/chat/${chatId}`)
          .set("Authorization", "Bearer " + user1Token)
          .send(newMessage)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        expect(response.body.text).toBe(newMessage.text);
      });

      it("should return 400 if message text is missing", async () => {
        await api
          .post(`/api/chat/${chatId}`)
          .set("Authorization", "Bearer " + user1Token)
          .send({})
          .expect(400);
      });

      it("should return 404 for non-existing chat ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await api
          .post(`/api/chat/${nonExistentId}`)
          .set("Authorization", "Bearer " + user1Token)
          .send({ text: "Message to non-existent chat" })
          .expect(404);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api
          .post(`/api/chat/${chatId}`)
          .send({ text: "Unauthorized message" })
          .expect(401);
      });
    });
  });

  // ────────────────── DELETE /api/chat/:chatId ──────────────────
  describe("DELETE /api/chat/:chatId", () => {
    let chatId = null;

    beforeEach(async () => {
      const chatResponse = await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({
          otherUserId: user2Id,
          text: "Chat to delete",
        });
      chatId = chatResponse.body._id;
    });

    describe("when the user is authenticated", () => {
      it("should delete the chat with status 204", async () => {
        await api
          .delete(`/api/chat/${chatId}`)
          .set("Authorization", "Bearer " + user1Token)
          .expect(204);

        // Verify chat was deleted
        const chatsAtEnd = await chatsInDb();
        expect(chatsAtEnd.map((c) => c._id.toString())).not.toContain(
          chatId.toString()
        );
      });

      it("should return 404 for non-existing chat ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await api
          .delete(`/api/chat/${nonExistentId}`)
          .set("Authorization", "Bearer " + user1Token)
          .expect(404);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.delete(`/api/chat/${chatId}`).expect(401);
      });
    });
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});