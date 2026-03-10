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

    expect(response.body).toHaveProperty("cities");
    expect(Array.isArray(response.body.cities)).toBe(true);
  });

  it("should return cities as an array of strings", async () => {
    const response = await api.get("/api/locations").expect(200);

    if (response.body.cities.length > 0) {
      expect(typeof response.body.cities[0]).toBe("string");
    }
  });

  it("should not require authentication", async () => {
    const response = await api.get("/api/locations").expect(200);
    expect(response.status).toBe(200);
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});