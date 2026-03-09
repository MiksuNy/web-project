const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

// ────────────────── GET /api/locations ──────────────────
describe("GET /api/locations", () => {
  it("should return all locations/municipalities as JSON with status 200", async () => {
    const response = await api
      .get("/api/locations")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should return an array of location objects", async () => {
    const response = await api.get("/api/locations").expect(200);

    if (response.body.length > 0) {
      const location = response.body[0];
      // Check that locations have expected properties
      // Adjust these based on your actual location data structure
      expect(location).toHaveProperty("name");
    }
  });

  it("should not require authentication", async () => {
    // This endpoint should be public
    const response = await api.get("/api/locations").expect(200);

    expect(response.status).toBe(200);
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});