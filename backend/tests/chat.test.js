const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

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

  await api.post("/api/auth/register").send({
    firstName: "Alice",
    lastName: "Smith",
    dateOfBirth: "12.3.2000",
    email: "alice@user.com",
    password: "123456",
    location: "Helsinki",
    phone: "1111111",
  });

  await api.post("/api/auth/register").send({
    firstName: "Bob",
    lastName: "Jones",
    dateOfBirth: "12.3.2000",
    email: "bob@user.com",
    password: "123456",
    location: "Vantaa",
    phone: "2222222",
  });

  const login1 = await api
    .post("/api/auth/login")
    .send({ email: "alice@user.com", password: "123456" })
    .expect(200);

  const login2 = await api
    .post("/api/auth/login")
    .send({ email: "bob@user.com", password: "123456" })
    .expect(200);

  user1Token = login1.body.token;
  user2Token = login2.body.token;

  const u1 = await User.findOne({ email: "alice@user.com" });
  const u2 = await User.findOne({ email: "bob@user.com" });

  user1Id = String(u1._id);
  user2Id = String(u2._id);
});

describe("Chat Routes", () => {
  beforeEach(async () => {
    await Chat.deleteMany({});
    await Message.deleteMany({});
  });

  // ────────────────── POST /api/chat (create chat/request) ──────────────────
  describe("POST /api/chat", () => {
    describe("when the user is authenticated", () => {
      it("should create a new chat request with initial message", async () => {
        const response = await api
          .post("/api/chat")
          .set("Authorization", "Bearer " + user1Token)
          .send({
            otherUserId: user2Id,
            subject: "Need help",
            text: "Hi Bob, let's chat",
          })
          .expect(201)
          .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("status");

        const chatsAtEnd = await chatsInDb();
        const messagesAtEnd = await messagesInDb();
        expect(chatsAtEnd).toHaveLength(1);
        expect(messagesAtEnd.length).toBeGreaterThan(0);
      });

      it("should return 400 if otherUserId is missing", async () => {
        const result = await api
          .post("/api/chat")
          .set("Authorization", "Bearer " + user1Token)
          .send({ text: "Missing user ID" })
          .expect(400);

        expect(result.body).toHaveProperty("message");
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api
          .post("/api/chat")
          .send({ otherUserId: user2Id, text: "Unauthorized request" })
          .expect(401);
      });
    });
  });

  // ────────────────── GET /api/chat/my-chats ──────────────────
  describe("GET /api/chat/my-chats", () => {
    beforeEach(async () => {
      const chatResponse = await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({ otherUserId: user2Id, text: "Initial message" });

      await api
        .patch(`/api/chat/requests/${chatResponse.body._id}/accept`)
        .set("Authorization", "Bearer " + user2Token);
    });

    describe("when the user is authenticated", () => {
      it("should return user's chats", async () => {
        const response = await api
          .get("/api/chat/my-chats")
          .set("Authorization", "Bearer " + user1Token)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(Array.isArray(response.body)).toBe(true);
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
      await api
        .post("/api/chat")
        .set("Authorization", "Bearer " + user1Token)
        .send({ otherUserId: user2Id, text: "Request message" });
    });

    describe("when the user is authenticated", () => {
      it("should return pending requests for user", async () => {
        const response = await api
          .get("/api/chat/my-requests")
          .set("Authorization", "Bearer " + user2Token)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("status", "pending");
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
        .send({ otherUserId: user2Id, text: "Request to accept" });

      chatId = chatResponse.body._id;
    });

    describe("when the user is authenticated", () => {
      it("should accept the chat request with status 200", async () => {
        const response = await api
          .patch(`/api/chat/requests/${chatId}/accept`)
          .set("Authorization", "Bearer " + user2Token)
          .expect(200);

        const status = response.body?.status || response.body?.chat?.status;
        expect(status).toBe("accepted");
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.patch(`/api/chat/requests/${chatId}/accept`).expect(401);
      });
    });

    describe("authorization checks", () => {
      it("should prevent non-participants from accepting the request", async () => {
        await api.post("/api/auth/register").send({
          firstName: "Eve",
          lastName: "Wilson",
          dateOfBirth: "12.3.2000",
          email: "eve@user.com",
          password: "123456",
          location: "Turku",
          phone: "4444444",
        });

        const eveLogin = await api
          .post("/api/auth/login")
          .send({ email: "eve@user.com", password: "123456" })
          .expect(200);

        await api
          .patch(`/api/chat/requests/${chatId}/accept`)
          .set("Authorization", "Bearer " + eveLogin.body.token)
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
        .send({ otherUserId: user2Id, text: "Request to decline" });

      chatId = chatResponse.body._id;
    });

    describe("when the user is authenticated", () => {
      it("should decline the chat request with status 200", async () => {
        const response = await api
          .patch(`/api/chat/requests/${chatId}/decline`)
          .set("Authorization", "Bearer " + user2Token)
          .expect(200);

        const status = response.body?.status || response.body?.chat?.status;
        expect(status).toBe("declined");
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
        .send({ otherUserId: user2Id, text: "Request to decline then reopen" });

      chatId = chatResponse.body._id;

      await api
        .patch(`/api/chat/requests/${chatId}/decline`)
        .set("Authorization", "Bearer " + user2Token);
    });

    describe("when the user is authenticated", () => {
      it("should reopen a declined chat request with status 200", async () => {
        const response = await api
          .patch(`/api/chat/requests/${chatId}/reopen`)
          .set("Authorization", "Bearer " + user1Token)
          .send({ text: "reopen please" })
          .expect(200);

        expect(response.body).toHaveProperty("chat");
        expect(response.body.chat.status).toBe("pending");
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
        .send({ otherUserId: user2Id, text: "Chat info request" });

      chatId = chatResponse.body._id;
    });

    describe("when the user is authenticated", () => {
      it("should return chat information", async () => {
        const response = await api
          .get(`/api/chat/${chatId}/info`)
          .set("Authorization", "Bearer " + user1Token)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveProperty("_id", chatId);
        expect(Array.isArray(response.body.participants)).toBe(true);
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
        .send({ otherUserId: user2Id, text: "First message" });

      chatId = chatResponse.body._id;

      await api
        .patch(`/api/chat/requests/${chatId}/accept`)
        .set("Authorization", "Bearer " + user2Token);

      await api
        .post(`/api/chat/${chatId}`)
        .set("Authorization", "Bearer " + user2Token)
        .send({ text: "Second message" });
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
        .send({ otherUserId: user2Id, text: "Initial message" });

      chatId = chatResponse.body._id;

      await api
        .patch(`/api/chat/requests/${chatId}/accept`)
        .set("Authorization", "Bearer " + user2Token);
    });

    describe("when the user is authenticated", () => {
      it("should send a new message to the chat", async () => {
        const response = await api
          .post(`/api/chat/${chatId}`)
          .set("Authorization", "Bearer " + user1Token)
          .send({ text: "This is a new message" })
          .expect(201)
          .expect("Content-Type", /application\/json/);

        expect(response.body.text).toBe("This is a new message");
      });

      it("should return 400 if message text is missing", async () => {
        await api
          .post(`/api/chat/${chatId}`)
          .set("Authorization", "Bearer " + user1Token)
          .send({})
          .expect(400);
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
        .send({ otherUserId: user2Id, text: "Chat to delete" });

      chatId = chatResponse.body._id;
    });

    describe("when the user is authenticated", () => {
      it("should delete the chat", async () => {
        await api
          .delete(`/api/chat/${chatId}`)
          .set("Authorization", "Bearer " + user1Token)
          .expect((res) => {
            if (![200, 204].includes(res.status)) {
              throw new Error(`Expected 200/204, got ${res.status}`);
            }
          });

        const chatsAtEnd = await chatsInDb();
        expect(chatsAtEnd.map((c) => String(c._id))).not.toContain(
          String(chatId),
        );
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
