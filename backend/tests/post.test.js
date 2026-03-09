const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Post = require("../models/postModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Seed data for posts
const posts = [
  {
    type: "request",
    title: "Need help with grocery shopping",
    description: "Looking for someone to help with weekly groceries",
    category: "Shopping",
    location: "Helsinki",
    budget: 15,
  },
  {
    type: "offer",
    title: "Offering gardening services",
    description: "Professional gardening help available",
    category: "Gardening",
    location: "Vantaa",
    budget: 25,
  },
];

// Helper: read all posts straight from the DB
const postsInDb = async () => {
  const allPosts = await Post.find({});
  return allPosts.map((p) => p.toJSON());
};

let token = null;
let userId = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/auth/register").send({
    firstName: "Post",
    lastName: "Creator",
    dateOfBirth: "12.3.2000",
    email: "post@user.com",
    password: "123456",
    location: "Helsinki",
    phone: "1234567",
  });
  token = result.body.token;
  userId = result.body.id || result.body._id;
});

describe("Post Routes", () => {
  // Seed posts via the API (so user_id is set by the controller)
  beforeEach(async () => {
    await Post.deleteMany({});
    await Promise.all(
      posts.map((post) =>
        api
          .post("/api/posts")
          .set("Authorization", "Bearer " + token)
          .send(post)
      )
    );
  });

  // ────────────────── GET /api/posts ──────────────────
  describe("GET /api/posts", () => {
    it("should return all posts as JSON with status 200", async () => {
      const response = await api
        .get("/api/posts")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveLength(posts.length);
    });

    it("should return posts with all required fields", async () => {
      const response = await api.get("/api/posts").expect(200);

      const post = response.body[0];
      expect(post).toHaveProperty("type");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("description");
      expect(post).toHaveProperty("category");
      expect(post).toHaveProperty("location");
      expect(post).toHaveProperty("budget");
    });

    it("should return an empty array when no posts exist", async () => {
      await Post.deleteMany({});

      const response = await api.get("/api/posts").expect(200);

      expect(response.body).toHaveLength(0);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // ────────────────── GET /api/posts/user/:userId ──────────────────
  describe("GET /api/posts/user/:userId", () => {
    it("should return all posts by a specific user", async () => {
      const response = await api
        .get(`/api/posts/user/${userId}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.length).toBeGreaterThan(0);
      // All posts should belong to the same user
      response.body.forEach((post) => {
        expect(post.user_id || post.userId).toBe(userId);
      });
    });

    it("should return an empty array for a user with no posts", async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const response = await api
        .get(`/api/posts/user/${nonExistentUserId}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it("should return 400 for invalid user ID format", async () => {
      await api.get("/api/posts/user/invalid-id").expect(400);
    });
  });

  // ────────────────── GET /api/posts/:postId ──────────────────
  describe("GET /api/posts/:postId", () => {
    it("should return one post by ID", async () => {
      const post = await Post.findOne();
      const response = await api
        .get(`/api/posts/${post._id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.title).toBe(post.title);
      expect(response.body.description).toBe(post.description);
    });

    it("should return 404 for a non-existing post ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await api.get(`/api/posts/${nonExistentId}`).expect(404);
    });

    it("should return 400 for invalid post ID format", async () => {
      await api.get("/api/posts/invalid-id").expect(400);
    });
  });

  // ────────────────── POST /api/posts (protected) ──────────────────
  describe("POST /api/posts", () => {
    describe("when the user is authenticated", () => {
      it("should create a new post with status 201", async () => {
        const newPost = {
          type: "offer",
          title: "Computer repair services",
          description: "Expert computer repair at affordable prices",
          category: "Technology",
          location: "Espoo",
          budget: 30,
        };

        const response = await api
          .post("/api/posts")
          .set("Authorization", "Bearer " + token)
          .send(newPost)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        expect(response.body.title).toBe(newPost.title);
        expect(response.body.description).toBe(newPost.description);
        expect(response.body.category).toBe(newPost.category);

        const postsAtEnd = await postsInDb();
        expect(postsAtEnd).toHaveLength(posts.length + 1);
      });

      it("should associate the post with the authenticated user", async () => {
        const newPost = {
          type: "request",
          title: "Pet sitting needed",
          description: "Need someone to watch my cat for a week",
          category: "Pets",
          location: "Helsinki",
          budget: 50,
        };

        const response = await api
          .post("/api/posts")
          .set("Authorization", "Bearer " + token)
          .send(newPost)
          .expect(201);

        expect(response.body.user_id || response.body.userId).toBe(userId);
      });

      it("should return 400 if required fields are missing", async () => {
        const incompletePost = {
          title: "Missing fields",
        };

        const result = await api
          .post("/api/posts")
          .set("Authorization", "Bearer " + token)
          .send(incompletePost)
          .expect(400);

        expect(result.body).toHaveProperty("error");

        const postsAtEnd = await postsInDb();
        expect(postsAtEnd).toHaveLength(posts.length);
      });

      it("should handle posts with type 'request'", async () => {
        const requestPost = {
          type: "request",
          title: "Need moving help",
          description: "Moving to new apartment, need assistance",
          category: "Moving",
          location: "Vantaa",
          budget: 40,
        };

        const response = await api
          .post("/api/posts")
          .set("Authorization", "Bearer " + token)
          .send(requestPost)
          .expect(201);

        expect(response.body.type).toBe("request");
      });

      it("should handle posts with type 'offer'", async () => {
        const offerPost = {
          type: "offer",
          title: "Tutoring services available",
          description: "Math and physics tutoring",
          category: "Education",
          location: "Helsinki",
          budget: 35,
        };

        const response = await api
          .post("/api/posts")
          .set("Authorization", "Bearer " + token)
          .send(offerPost)
          .expect(201);

        expect(response.body.type).toBe("offer");
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        const newPost = {
          type: "offer",
          title: "Unauthorized post",
          description: "This should fail",
          category: "Other",
          location: "Helsinki",
          budget: 10,
        };

        await api.post("/api/posts").send(newPost).expect(401);

        const postsAtEnd = await postsInDb();
        expect(postsAtEnd).toHaveLength(posts.length);
      });

      it("should return 401 for invalid token", async () => {
        await api
          .post("/api/posts")
          .set("Authorization", "Bearer invalid-token")
          .send(posts[0])
          .expect(401);
      });

      it("should return 401 for expired token", async () => {
        const user = await User.findOne({ email: "post@user.com" });
        const expiredToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.SECRET || process.env.JWT_SECRET,
          { expiresIn: "-1s" }
        );

        await api
          .post("/api/posts")
          .set("Authorization", "Bearer " + expiredToken)
          .send(posts[0])
          .expect(401);
      });
    });
  });

  // ────────────────── PUT /api/posts/:postId (protected) ──────────────────
  describe("PUT /api/posts/:postId", () => {
    describe("when the user is authenticated", () => {
      it("should update the post and return the updated document", async () => {
        const post = await Post.findOne();
        const updates = {
          title: "Updated Post Title",
          budget: 100,
        };

        const response = await api
          .put(`/api/posts/${post._id}`)
          .set("Authorization", "Bearer " + token)
          .send(updates)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(response.body.title).toBe(updates.title);
        expect(response.body.budget).toBe(updates.budget);

        const updatedPost = await Post.findById(post._id);
        expect(updatedPost.title).toBe(updates.title);
        expect(updatedPost.budget).toBe(updates.budget);
      });

      it("should allow partial updates", async () => {
        const post = await Post.findOne();
        const updates = {
          description: "Only updating description",
        };

        const response = await api
          .put(`/api/posts/${post._id}`)
          .set("Authorization", "Bearer " + token)
          .send(updates)
          .expect(200);

        expect(response.body.description).toBe(updates.description);
        // Other fields should remain unchanged
        expect(response.body.title).toBe(post.title);
      });

      it("should return 404 for non-existing post ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await api
          .put(`/api/posts/${nonExistentId}`)
          .set("Authorization", "Bearer " + token)
          .send({ title: "Updated" })
          .expect(404);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        const post = await Post.findOne();
        await api
          .put(`/api/posts/${post._id}`)
          .send({ title: "Hacker Update" })
          .expect(401);
      });
    });

    describe("authorization checks", () => {
      it("should prevent users from updating other users' posts", async () => {
        // Create a second user
        const secondUser = await api.post("/api/auth/register").send({
          firstName: "Second",
          lastName: "User",
          dateOfBirth: "12.3.2000",
          email: "second@user.com",
          password: "123456",
          location: "Vantaa",
          phone: "7654321",
        });

        const post = await Post.findOne();

        // Try to update first user's post with second user's token
        const result = await api
          .put(`/api/posts/${post._id}`)
          .set("Authorization", "Bearer " + secondUser.body.token)
          .send({ title: "Unauthorized Update" })
          .expect(403);

        expect(result.body).toHaveProperty("error");
      });
    });
  });

  // ────────────────── DELETE /api/posts/:postId (protected) ──────────────────
  describe("DELETE /api/posts/:postId", () => {
    describe("when the user is authenticated", () => {
      it("should delete the post and return status 204", async () => {
        const postsAtStart = await postsInDb();
        const postToDelete = postsAtStart[0];

        await api
          .delete(`/api/posts/${postToDelete._id}`)
          .set("Authorization", "Bearer " + token)
          .expect(204);

        const postsAtEnd = await postsInDb();
        expect(postsAtEnd).toHaveLength(postsAtStart.length - 1);
        expect(postsAtEnd.map((p) => p.title)).not.toContain(
          postToDelete.title
        );
      });

      it("should return 404 for non-existing post ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await api
          .delete(`/api/posts/${nonExistentId}`)
          .set("Authorization", "Bearer " + token)
          .expect(404);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        const post = await Post.findOne();
        await api.delete(`/api/posts/${post._id}`).expect(401);

        // Verify post was NOT deleted
        const postStillExists = await Post.findById(post._id);
        expect(postStillExists).not.toBeNull();
      });
    });

    describe("authorization checks", () => {
      it("should prevent users from deleting other users' posts", async () => {
        // Create a second user
        const secondUser = await api.post("/api/auth/register").send({
          firstName: "Third",
          lastName: "User",
          dateOfBirth: "12.3.2000",
          email: "third@user.com",
          password: "123456",
          location: "Espoo",
          phone: "9999999",
        });

        const post = await Post.findOne();

        // Try to delete first user's post with second user's token
        const result = await api
          .delete(`/api/posts/${post._id}`)
          .set("Authorization", "Bearer " + secondUser.body.token)
          .expect(403);

        expect(result.body).toHaveProperty("error");

        // Verify post was NOT deleted
        const postStillExists = await Post.findById(post._id);
        expect(postStillExists).not.toBeNull();
      });
    });
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});