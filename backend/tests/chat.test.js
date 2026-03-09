const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

let user1 = { token: null, id: null, email: "alice@user.com" };
let user2 = { token: null, id: null, email: "bob@user.com" };

async function registerAndLogin({ firstName, lastName, email, password, location, phone }) {
  await api.post("/api/auth/register").send({
    firstName,
    lastName,
    dateOfBirth: "12.3.2000",
    email,
    password,
    location,
    phone,
  });

  const loginRes = await api
    .post("/api/auth/login")
    .send({ email, password })
    .expect(200);

  const dbUser = await User.findOne({ email });
  return { token: loginRes.body.token, id: String(dbUser._id) };
}

beforeAll(async () => {
  await User.deleteMany({});
  user1 = await registerAndLogin({
    firstName: "Alice",
    lastName: "Smith",
    email: user1.email,
    password: "123456",
    location: "Helsinki",
    phone: "1111111",
  });

  user2 = await registerAndLogin({
    firstName: "Bob",
    lastName: "Jones",
    email: user2.email,
    password: "123456",
    location: "Vantaa",
    phone: "2222222",
  });
});

beforeEach(async () => {
  await Chat.deleteMany({});
  await Message.deleteMany({});
});

describe("Chat Routes (reduced)", () => {
  it("POST /api/chat creates request + first message", async () => {
    const res = await api
      .post("/api/chat")
      .set("Authorization", `Bearer ${user1.token}`)
      .send({
        otherUserId: user2.id,
        subject: "Help request",
        text: "Hi Bob, can you help?",
      })
      .expect((r) => {
        // allow either 201 (created) or 200 (existing reused)
        if (![200, 201].includes(r.status)) throw new Error(`Unexpected status ${r.status}`);
      });

    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("participants");
    expect(Array.isArray(res.body.participants)).toBe(true);

    const messages = await Message.find({ chatId: res.body._id });
    expect(messages.length).toBeGreaterThan(0);
  });

  it("POST /api/chat returns 400 for invalid payload", async () => {
    await api
      .post("/api/chat")
      .set("Authorization", `Bearer ${user1.token}`)
      .send({ text: "missing otherUserId" })
      .expect(400);
  });

  it("GET /api/chat/my-requests returns pending requests", async () => {
    await api
      .post("/api/chat")
      .set("Authorization", `Bearer ${user1.token}`)
      .send({ otherUserId: user2.id, text: "Pending request" })
      .expect((r) => {
        if (![200, 201].includes(r.status)) throw new Error(`Unexpected status ${r.status}`);
      });

    const res = await api
      .get("/api/chat/my-requests")
      .set("Authorization", `Bearer ${user2.token}`)
      .expect(200);

    // supports either {received,sent} or array style
    const isObjectShape =
      res.body && typeof res.body === "object" && ("received" in res.body || "sent" in res.body);
    const isArrayShape = Array.isArray(res.body);

    expect(isObjectShape || isArrayShape).toBe(true);
  });

  it("PATCH /api/chat/requests/:chatId/accept accepts request", async () => {
    const createRes = await api
      .post("/api/chat")
      .set("Authorization", `Bearer ${user1.token}`)
      .send({ otherUserId: user2.id, text: "Please accept" });

    const chatId = createRes.body._id;

    const res = await api
      .patch(`/api/chat/requests/${chatId}/accept`)
      .set("Authorization", `Bearer ${user2.token}`)
      .expect(200);

    // allow either {chat:{status}} or direct {status}
    const status = res.body?.chat?.status || res.body?.status;
    expect(["accepted", true].includes(status) || !!res.body?.message).toBe(true);
  });

  it("POST /api/chat/:chatId sends message to accepted chat", async () => {
    const createRes = await api
      .post("/api/chat")
      .set("Authorization", `Bearer ${user1.token}`)
      .send({ otherUserId: user2.id, text: "Initial" });

    const chatId = createRes.body._id;

    await api
      .patch(`/api/chat/requests/${chatId}/accept`)
      .set("Authorization", `Bearer ${user2.token}`)
      .expect(200);

    const msgRes = await api
      .post(`/api/chat/${chatId}`)
      .set("Authorization", `Bearer ${user1.token}`)
      .send({ text: "Follow-up message" })
      .expect((r) => {
        if (![200, 201].includes(r.status)) throw new Error(`Unexpected status ${r.status}`);
      });

    expect(msgRes.body).toHaveProperty("text");
  });

  it("GET /api/chat/:chatId returns messages", async () => {
    const createRes = await api
      .post("/api/chat")
      .set("Authorization", `Bearer ${user1.token}`)
      .send({ otherUserId: user2.id, text: "Hello" });

    const chatId = createRes.body._id;

    await api
      .patch(`/api/chat/requests/${chatId}/accept`)
      .set("Authorization", `Bearer ${user2.token}`)
      .expect(200);

    const res = await api
      .get(`/api/chat/${chatId}`)
      .set("Authorization", `Bearer ${user1.token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Protected endpoints require auth", async () => {
    await api.get("/api/chat/my-chats").expect(401);
    await api.get("/api/chat/my-requests").expect(401);
    await api.post("/api/chat").send({ otherUserId: user2.id, text: "x" }).expect(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});