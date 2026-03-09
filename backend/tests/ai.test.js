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

    const result = await api
      .post("/api/ai/ask")
      .send(emptyRequest)
      .expect(400);

    expect(result.body).toHaveProperty("message", "Message is required.");
  });

  it("should handle long messages", async () => {
    const longMessage = {
      message:
        "This is a very long message that tests the AI endpoint's ability to handle longer text inputs. It contains multiple sentences and should still be processed correctly by the AI service.",
    };

    const response = await api
      .post("/api/ai/ask")
      .send(longMessage)
      .expect(200);

    expect(response.body).toHaveProperty("reply");
  });

  it("should not require authentication", async () => {
    // This endpoint should be public (no auth required)
    const aiRequest = {
      message: "Hello AI!",
    };

    const response = await api.post("/api/ai/ask").send(aiRequest).expect(200);

    expect(response.status).toBe(200);
  });

  it("should handle special characters in messages", async () => {
    const specialCharsMessage = {
      message: "What about special chars: @#$%^&*()? Can you handle them?",
    };

    const response = await api
      .post("/api/ai/ask")
      .send(specialCharsMessage)
      .expect(200);

    expect(response.body).toHaveProperty("reply");
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});