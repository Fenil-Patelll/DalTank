const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../../app.js"); // Import your Express app
const Portfolio = require("../../models/portfolio");

describe("API Tests", () => {
  let mongoServer;
  let mongoClient;

  beforeAll(async () => {
    // Set up an in-memory MongoDB server for testing
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    mongoClient = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoClient.connect();
  });

  afterAll(async () => {
    // Close the MongoDB connection and stop the in-memory server
    await mongoClient.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Create sample data before each test if needed
    const sampleUserData = { _id: "12345", /* other fields */ };
    const samplePortfolioData = { _id: "67890", /* other fields */ };

    const db = mongoClient.db();
    await db.collection("users").insertOne(sampleUserData);
    await db.collection("investorportfolios").insertOne(samplePortfolioData);
  });

  afterEach(async () => {
    // Clear the test database after each test
    const db = mongoClient.db();
    await db.collection("users").deleteMany({});
    await db.collection("investorportfolios").deleteMany({});
  });

  describe("getProfile", () => {
    it("should return user profile and portfolio data", async () => {
      const response = await request(app)
        .post("/api/getProfile")
        .send({ userId: "sampleUserId" });
      expect(response.status).toBe(201);
      expect(response.body.result).toBeDefined();
      expect(response.body.portfolio).toBeDefined();
    });

    it("should return 500 Internal Server Error on database error", async () => {
      // Simulate a database error by closing the connection
      await mongoClient.close();

      const response = await request(app)
        .post("/api/getProfile")
        .send({ userId: "sampleUserId" });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");
    });
  });

  describe("editUser", () => {
    it("should update user data", async () => {
      const updatedUserData = { _id: "sampleUserId", /* updated fields */ };

      const response = await request(app)
        .post("/api/editUser")
        .send(updatedUserData);

      expect(response.status).toBe(200);
      expect(response.body.updatedUser).toBeDefined();
    });

    it("should return 500 Internal Server Error on database error", async () => {
      // Simulate a database error by closing the connection
      await mongoClient.close();

      const updatedUserData = { _id: "sampleUserId", /* updated fields */ };

      const response = await request(app)
        .post("/api/editUser")
        .send(updatedUserData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");
    });
  });

  describe("editPortfolio", () => {
    it("should update portfolio data", async () => {
      const updatedPortfolioData = { _id: "samplePortfolioId", /* updated fields */ };

      const response = await request(app)
        .post("/api/editPortfolio")
        .send(updatedPortfolioData);

      expect(response.status).toBe(200);
      expect(response.body.updatedPortfolio).toBeDefined();
    });

    it("should return 500 Internal Server Error on database error", async () => {
      // Simulate a database error by closing the connection
      await mongoClient.close();

      const updatedPortfolioData = { _id: "samplePortfolioId", /* updated fields */ };

      const response = await request(app)
        .post("/api/editPortfolio")
        .send(updatedPortfolioData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");
    });
  });
});
