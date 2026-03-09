const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Post = require("../models/postModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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

const postsInDb = async () => {
  const allPosts = await Post.find({});
  return allPosts.map((p) => p.toJSON());
};

let token = null;
let userId = null;

const registerAndLogin = async ({
  firstName,
  lastName,
  email,
  password,
  location,
  phone,
}) => {
  await api.post("/api/auth/register").send({
    firstName,
    lastName,
    dateOfBirth: "12.3.2000",
    email,
    password,
    location,
    phone,
  });

  const login = await api.post("/api/auth/login").send({ email, password }).expect(200);
  const user = await User.findOne({ email });

  return { token: login.body.token, userId: String(user._id) };
};

beforeAll(async () => {
  await User.deleteMany({});
  const auth = await registerAndLogin({
    firstName: "Post",
    lastName: "Creator",
    email: "post@user.com",
    password: "123456",
    location: "Helsinki",
    phone: "1234567",
  });
  token = auth.token;
  userId = auth.userId;
});

describe("Post Routes", () => {
  beforeEach(async () => {
    await Post.deleteMany({});
    await Promise.all(
      posts.map((post) =>
        api.post("/api/posts").set("Authorization", "Bearer " + token).send(post).expect(201)
      )
    );
  });

  // 
  describe("GET /api/posts", () => {
    it("should return all posts as JSON with status 200", async () => {
      const response = await api
        .get("/api/posts")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveProperty("posts");
      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.posts).toHaveLength(posts.length);
    });

    it("should return posts with all required fields", async () => {
      const response = await api.get("/api/posts").expect(200);
      const post = response.body.posts[0];

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

      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.posts).toHaveLength(0);
    });
  });

  describe("GET /api/posts/user/:userId", () => {
    it("should return all posts by a specific user", async () => {
      const response = await api
        .get(`/api/posts/user/${userId}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.posts.length).toBeGreaterThan(0);

      response.body.posts.forEach((post) => {
        expect(String(post.user?._id)).toBe(String(userId));
      });
    });

    it("should return an empty array for a user with no posts", async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const response = await api.get(`/api/posts/user/${nonExistentUserId}`).expect(200);
      expect(response.body.posts).toHaveLength(0);
    });

    it("should return 500 for invalid user ID format", async () => {
      await api.get("/api/posts/user/invalid-id").expect(500);
    });
  });

  describe("GET /api/posts/:postId", () => {
    it("should return one post by ID", async () => {
      const post = await Post.findOne();
      const response = await api
        .get(`/api/posts/${post._id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveProperty("post");
      expect(response.body.post.title).toBe(post.title);
      expect(response.body.post.description).toBe(post.description);
    });

    it("should return 404 for a non-existing post ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await api.get(`/api/posts/${nonExistentId}`).expect(404);
    });

    it("should return 500 for invalid post ID format", async () => {
      await api.get("/api/posts/invalid-id").expect(500);
    });
  });

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

        expect(response.body).toHaveProperty("post");
        expect(response.body.post.title).toBe(newPost.title);
        expect(response.body.post.description).toBe(newPost.description);
        expect(response.body.post.category).toBe(newPost.category);

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

        expect(String(response.body.post.user)).toBe(String(userId));
      });

      it("should return 400 if required fields are missing", async () => {
        const incompletePost = { title: "Missing fields" };

        const result = await api
          .post("/api/posts")
          .set("Authorization", "Bearer " + token)
          .send(incompletePost)
          .expect(400);

        expect(result.body).toHaveProperty("message");
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

        expect(response.body.post.type).toBe("request");
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

        expect(response.body.post.type).toBe("offer");
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        await api.post("/api/posts").send(posts[0]).expect(401);

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

describe("PUT /api/posts/:postId", () => {
  describe("when the user is authenticated", () => {
    it("should update the post and return the updated document", async () => {
      const post = await Post.findOne();

      const updates = {
        type: "request",
        title: "Updated Post Title",
        description: "Updated description",
        category: "Transportation",
        location: "Helsinki",
        budget: 100,
      };

      const response = await api
        .put(`/api/posts/${post._id}`)
        .set("Authorization", "Bearer " + token)
        .send(updates)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.post.title).toBe(updates.title);
      expect(response.body.post.budget).toBe(updates.budget);
    });

    it("should return 400 for partial payload (blocked by validatePost middleware)", async () => {
      const post = await Post.findOne();
      const updates = { description: "Only updating description" };

      await api
        .put(`/api/posts/${post._id}`)
        .set("Authorization", "Bearer " + token)
        .send(updates)
        .expect(400);
    });
  

      it("should return 400 for non-existing post ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await api
          .put(`/api/posts/${nonExistentId}`)
          .set("Authorization", "Bearer " + token)
          .send({ title: "Updated" })
          .expect(400);
      });
    });

    describe("when the user is not authenticated", () => {
      it("should return 401 if no token is provided", async () => {
        const post = await Post.findOne();
        await api.put(`/api/posts/${post._id}`).send({ title: "Hacker Update" }).expect(401);
      });
    });

    describe("authorization checks", () => {
      it("should prevent users from updating other users' posts", async () => {
        const second = await registerAndLogin({
          firstName: "Second",
          lastName: "User",
          email: "second@user.com",
          password: "123456",
          location: "Vantaa",
          phone: "7654321",
        });

        const post = await Post.findOne();

        const result = await api
          .put(`/api/posts/${post._id}`)
          .set("Authorization", "Bearer " + second.token)
          .send({ title: "Unauthorized Update" })
          .expect(400);

        expect(result.body).toHaveProperty("message", "Invalid type");
      });
    });
  });

  describe("DELETE /api/posts/:postId", () => {
    describe("when the user is authenticated", () => {
      it("should delete the post and return status 200", async () => {
        const postsAtStart = await postsInDb();
        const postToDelete = postsAtStart[0];

        await api
          .delete(`/api/posts/${postToDelete._id}`)
          .set("Authorization", "Bearer " + token)
          .expect(200);

        const postsAtEnd = await postsInDb();
        expect(postsAtEnd).toHaveLength(postsAtStart.length - 1);
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

        const postStillExists = await Post.findById(post._id);
        expect(postStillExists).not.toBeNull();
      });
    });

    describe("authorization checks", () => {
      it("should prevent users from deleting other users' posts", async () => {
        const third = await registerAndLogin({
          firstName: "Third",
          lastName: "User",
          email: "third@user.com",
          password: "123456",
          location: "Espoo",
          phone: "9999999",
        });

        const post = await Post.findOne();

        const result = await api
          .delete(`/api/posts/${post._id}`)
          .set("Authorization", "Bearer " + third.token)
          .expect(403);

        expect(result.body).toHaveProperty("message", "Not allowed");

        const postStillExists = await Post.findById(post._id);
        expect(postStillExists).not.toBeNull();
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});