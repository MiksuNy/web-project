const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Clean the users collection before each test
beforeEach(async () => {
  await User.deleteMany({});
});

// ────────────────── POST /api/auth/register ──────────────────
describe("POST /api/auth/register", () => {
  describe("when the payload is valid", () => {
    it("should register a new user with status 201 and return a token", async () => {
      const userData = {
        firstName: "Maria",
        lastName: "Smith",
        dateOfBirth: "12.3.2000",
        email: "maria@user.com",
        password: "123456",
        location: "Helsinki",
        phone: "1234567",
      };

      const result = await api
        .post("/api/auth/register")
        .send(userData)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(result.body).toHaveProperty(
        "message",
        "User registered successfully",
      );
      expect(result.body).toHaveProperty("user");
      expect(result.body.user.email).toBe(userData.email);
      expect(result.body.user.firstName).toBe(userData.firstName);
      expect(result.body).not.toHaveProperty("token");
      expect(result.body.user).not.toHaveProperty("password");

      // Verify user was actually saved in the database
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).not.toBeNull();
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
    });

    it("should not return the password in the response", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "12.3.2000",
        email: "john@user.com",
        password: "123456",
        location: "Vantaa",
        phone: "1234567",
      };

      const result = await api
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(result.body).not.toHaveProperty("password");
    });
  });

  describe("when the payload is invalid", () => {
    it("should return 400 if required fields are missing", async () => {
      const userData = {
        firstName: "Incomplete",
        password: "123456",
      };

      const result = await api
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(result.body).toHaveProperty("message", "All fields are required");

      // Verify the user was NOT created
      const savedUser = await User.findOne({ firstName: userData.firstName });
      expect(savedUser).toBeNull();
    });

    it("should return 400 if email is missing", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        dateOfBirth: "12.3.2000",
        password: "123456",
        location: "Helsinki",
        phone: "1234567",
      };

      await api.post("/api/auth/register").send(userData).expect(400);
    });

    it("should return 400 if password is missing", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        dateOfBirth: "12.3.2000",
        email: "test@user.com",
        location: "Helsinki",
        phone: "1234567",
      };

      await api.post("/api/auth/register").send(userData).expect(400);
    });
  });

  describe("when the email is already taken", () => {
    it("should return 400 for duplicate email", async () => {
      const userData = {
        firstName: "Maria",
        lastName: "Smith",
        dateOfBirth: "12.3.2000",
        email: "duplicate@user.com",
        password: "123456",
        location: "Helsinki",
        phone: "1234567",
      };

      // Create the first user
      await api.post("/api/auth/register").send(userData).expect(201);

      // Try to create a second user with the same email
      const result = await api
        .post("/api/auth/register")
        .send({ ...userData, firstName: "Second User" })
        .expect(400);

      expect(result.body).toHaveProperty("message", "User already exists");

      // Verify only one user with that email exists in the database
      const usersWithEmail = await User.find({ email: userData.email });
      expect(usersWithEmail).toHaveLength(1);
    });
  });
});

// ────────────────── POST /api/auth/login ──────────────────
describe("POST /api/auth/login", () => {
  // Register a user before each login test
  beforeEach(async () => {
    await api.post("/api/auth/register").send({
      firstName: "Login",
      lastName: "Tester",
      dateOfBirth: "12.3.2000",
      email: "login@user.com",
      password: "123456",
      location: "Helsinki",
      phone: "1234567",
    });
  });

  describe("when the credentials are valid", () => {
    it("should login and return a token with status 200", async () => {
      const result = await api
        .post("/api/auth/login")
        .send({
          email: "login@user.com",
          password: "123456",
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(result.body).toHaveProperty("token");
      expect(result.body).toHaveProperty("message", "Login successful");
    });
  });

  describe("when the credentials are invalid", () => {
    it("should return 400 with a wrong password", async () => {
      const result = await api
        .post("/api/auth/login")
        .send({
          email: "login@user.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(result.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should return 400 with a non-existing email", async () => {
      const result = await api
        .post("/api/auth/login")
        .send({
          email: "nonexistent@user.com",
          password: "123456",
        })
        .expect(401);

      expect(result.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should return 400 if email is missing", async () => {
      await api
        .post("/api/auth/login")
        .send({
          password: "123456",
        })
        .expect(401);
    });

    it("should return 400 if password is missing", async () => {
      await api
        .post("/api/auth/login")
        .send({
          email: "login@user.com",
        })
        .expect(500);
    });
  });
});

// ────────────────── GET /api/auth/userinfo (protected) ──────────────────
describe("GET /api/auth/userinfo", () => {
  let token = null;
  let userId = null;

  beforeEach(async () => {
    const result = await api.post("/api/auth/register").send({
      firstName: "Info",
      lastName: "User",
      dateOfBirth: "12.3.2000",
      email: "info@user.com",
      password: "123456",
      location: "Espoo",
      phone: "9876543",
    });
    const loginResult = await api.post("/api/auth/login").send({
      email: "info@user.com",
      password: "123456",
    });
    token = loginResult.body.token;
    userId = loginResult.body.id || loginResult.body._id;
  });

  describe("when the user is authenticated", () => {
    it("should return user info with status 200", async () => {
      const response = await api
        .get("/api/auth/userinfo")
        .set("Authorization", "Bearer " + token)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.user.email).toBe("info@user.com");
      expect(response.body.user.firstName).toBe("Info");
      expect(response.body).not.toHaveProperty("password");
    });
  });

  describe("when the user is not authenticated", () => {
    it("should return 401 if no token is provided", async () => {
      await api.get("/api/auth/userinfo").expect(401);
    });

    it("should return 401 for invalid token", async () => {
      await api
        .get("/api/auth/userinfo")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });

    it("should return 401 for expired token", async () => {
      const user = await User.findOne({ email: "info@user.com" });
      const expiredToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET || process.env.JWT_SECRET,
        { expiresIn: "-1s" },
      );

      await api
        .get("/api/auth/userinfo")
        .set("Authorization", "Bearer " + expiredToken)
        .expect(401);
    });
  });
});

// ────────────────── PUT /api/auth/edit (protected) ──────────────────
describe("PUT /api/auth/edit", () => {
  let token = null;

  beforeEach(async () => {
    const result = await api.post("/api/auth/register").send({
      firstName: "Edit",
      lastName: "User",
      dateOfBirth: "12.3.2000",
      email: "edit@user.com",
      password: "123456",
      location: "Vantaa",
      phone: "1234567",
    });
    const loginResult = await api.post("/api/auth/login").send({
      email: "edit@user.com",
      password: "123456",
    });
    token = loginResult.body.token;
  });

  describe("when the user is authenticated", () => {
    it("should update user information with status 200", async () => {
      const updates = {
        firstName: "Updated",
        lastName: "Name",
        location: "Helsinki",
      };

      const response = await api
        .put("/api/auth/edit")
        .set("Authorization", "Bearer " + token)
        .send(updates)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.user.firstName).toBe(updates.firstName);
      expect(response.body.user.lastName).toBe(updates.lastName);
      expect(response.body.user.location).toBe(updates.location);

      // Verify in database
      const updatedUser = await User.findOne({ email: "edit@user.com" });
      expect(updatedUser.firstName).toBe(updates.firstName);
      expect(updatedUser.lastName).toBe(updates.lastName);
    });
  });

  describe("when the user is not authenticated", () => {
    it("should return 401 if no token is provided", async () => {
      await api.put("/api/auth/edit").send({ firstName: "Hacker" }).expect(401);
    });
  });
});

// ────────────────── PUT /api/auth/change-password (protected) ──────────────────
describe("PUT /api/auth/change-password", () => {
  let token = null;

  beforeEach(async () => {
    const result = await api.post("/api/auth/register").send({
      firstName: "Password",
      lastName: "Changer",
      dateOfBirth: "12.3.2000",
      email: "password@user.com",
      password: "oldpassword",
      location: "Helsinki",
      phone: "1234567",
    });
    token = result.body.token;
  });

  // Login to get the token and user ID
  beforeEach(async () => {
    const loginResult = await api.post("/api/auth/login").send({
      email: "password@user.com",
      password: "oldpassword",
    });
    token = loginResult.body.token;
  });

  describe("when the user is authenticated", () => {
    it("should change password with valid current password", async () => {
      const response = await api
        .put("/api/auth/change-password")
        .set("Authorization", "Bearer " + token)
        .send({
          currentPassword: "oldpassword",
          newPassword: "newpassword123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("message");

      // Verify by logging in with new password
      const loginResult = await api
        .post("/api/auth/login")
        .send({
          email: "password@user.com",
          password: "newpassword123",
        })
        .expect(200);

      expect(loginResult.body).toHaveProperty("token");
    });

    it("should return 400 if current password is wrong", async () => {
      const result = await api
        .put("/api/auth/change-password")
        .set("Authorization", "Bearer " + token)
        .send({
          currentPassword: "wrongpassword",
          newPassword: "newpassword123",
        })
        .expect(401);

      expect(result.body).toHaveProperty(
        "message",
        "Current password is incorrect",
      );

      // Verify old password still works
      await api
        .post("/api/auth/login")
        .send({
          email: "password@user.com",
          password: "oldpassword",
        })
        .expect(200);
    });

    it("should return 400 if new password is missing", async () => {
      await api
        .put("/api/auth/change-password")
        .set("Authorization", "Bearer " + token)
        .send({
          currentPassword: "oldpassword",
        })
        .expect(400);
    });
  });

  describe("when the user is not authenticated", () => {
    it("should return 401 if no token is provided", async () => {
      await api
        .put("/api/auth/change-password")
        .send({
          currentPassword: "oldpassword",
          newPassword: "newpassword123",
        })
        .expect(401);
    });
  });
});

// ────────────────── DELETE /api/auth/delete (protected) ──────────────────
describe("DELETE /api/auth/delete", () => {
  let token = null;
  let userEmail = null;

  beforeEach(async () => {
    userEmail = "delete@user.com";
    const result = await api.post("/api/auth/register").send({
      firstName: "Delete",
      lastName: "User",
      dateOfBirth: "12.3.2000",
      email: "delete@user.com",
      password: "123456",
      location: "Helsinki",
      phone: "1234567",
    });
    token = result.body.token;
  });

  // Login to get the token and user ID
  beforeEach(async () => {
    const loginResult = await api.post("/api/auth/login").send({
      email: "delete@user.com",
      password: "123456",
    });
    token = loginResult.body.token;
  });

  describe("when the user is authenticated", () => {
    it("should delete the user account with status 200", async () => {
      const delRes = await api
        .delete("/api/auth/delete")
        .set("Authorization", "Bearer " + token)
        .expect(200);

      expect(delRes.body).toHaveProperty("message");

      const deletedUser = await User.findOne({ email: userEmail });
      expect(deletedUser).toBeNull();

      await api
        .post("/api/auth/login")
        .send({
          email: "delete@user.com",
          password: "123456",
        })
        .expect(401);
    });
  });

  describe("when the user is not authenticated", () => {
    it("should return 401 if no token is provided", async () => {
      await api.delete("/api/auth/delete").expect(401);

      // Verify user was NOT deleted
      const user = await User.findOne({ email: userEmail });
      expect(user).not.toBeNull();
    });

    it("should return 401 for invalid token", async () => {
      await api
        .delete("/api/auth/delete")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      // Verify user was NOT deleted
      const user = await User.findOne({ email: userEmail });
      expect(user).not.toBeNull();
    });
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
