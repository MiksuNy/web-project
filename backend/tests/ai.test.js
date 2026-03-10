const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

// ────────────────── POST /api/ai/ask ──────────────────
describe("POST /api/ai/ask", () => {
  it("should accept a message and return a response with status 200", async () => {
    const aiRequest = {
      message: "Could you advice how to be more productive?",
    };

    const response = await api
      .post("/api/ai/ask")
      .send(aiRequest)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveProperty("reply");
  });

  it("should return 400 if message is missing", async () => {
    const emptyRequest = {};
    const result = await api.post("/api/ai/ask").send(emptyRequest).expect(400);

    expect(result.body).toHaveProperty("message", "Message is required.");
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
