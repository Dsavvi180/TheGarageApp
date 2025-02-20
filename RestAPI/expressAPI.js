// Required Dependencies
import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion } from "mongodb";
import rateLimit from "express-rate-limit";
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import dotenv from "dotenv";

dotenv.config({ path: "./sensitive.env" });

const app = express();
const port = process.env.PORT || 3000;
const isDevelopment = String(process.env.NODE_ENV) === "development"; // Check if the app is in development mode

// Middleware
app.use(bodyParser.json());
app.use(clerkMiddleware());

// MongoDB Client Setup
const mongoClient = new MongoClient(process.env.MONGO_URI || "", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let db;
(async () => {
  try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.DB_NAME);
    await db.command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
})();

// Rate Limiting to Prevent DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Middleware for checking authorization or bypass in development mode
const optionalAuthMiddleware = (req, res, next) => {
  if (isDevelopment) {
    return next(); // Skip auth in development mode
  }

  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(401).json({ error: "Not authorized." });
  }

  next();
};

// Permission Middleware
const requireAdminPermission = (req, res, next) => {
  if (isDevelopment) {
    return next(); // Skip permission check in development mode
  }

  const auth = getAuth(req);
  if (!auth.userId || !auth.claims?.permissions?.includes("admin")) {
    return res
      .status(403)
      .json({ error: "Forbidden: Admin permission required." });
  }
  next();
};

// CRUD Operations
// 1. Create Collection
app.post(
  "/create-collection",
  optionalAuthMiddleware,
  requireAdminPermission,
  async (req, res) => {
    try {
      const { collectionName } = req.body;
      if (!collectionName)
        return res.status(400).json({ error: "Collection name is required." });

      await db.createCollection(collectionName);
      res.status(201).json({
        message: `Collection ${collectionName} created successfully.`,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 2. Write to Collection
app.post(
  "/write",
  optionalAuthMiddleware,
  requireAdminPermission,
  async (req, res) => {
    try {
      const { collectionName, document } = req.body;
      if (!collectionName || !document)
        return res
          .status(400)
          .json({ error: "Collection name and document are required." });

      const result = await db.collection(collectionName).insertOne(document);
      res.status(201).json({
        message: "Document inserted successfully.",
        documentId: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 3. Find from Collection
app.get("/find", optionalAuthMiddleware, async (req, res) => {
  try {
    const { collectionName, query } = req.query;
    if (!collectionName || !query)
      return res
        .status(400)
        .json({ error: "Collection name and query are required." });

    const parsedQuery = JSON.parse(query);
    const documents = await db
      .collection(collectionName)
      .find(parsedQuery)
      .toArray();
    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Delete from Collection
app.delete(
  "/delete",
  optionalAuthMiddleware,
  requireAdminPermission,
  async (req, res) => {
    try {
      const { collectionName, query } = req.body;
      if (!collectionName || !query)
        return res
          .status(400)
          .json({ error: "Collection name and query are required." });

      const parsedQuery = JSON.parse(query);
      const result = await db
        .collection(collectionName)
        .deleteMany(parsedQuery);
      res
        .status(200)
        .json({ message: `${result.deletedCount} documents deleted.` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 5. Update Document in Collection
app.put("/update", optionalAuthMiddleware, async (req, res) => {
  try {
    const { collectionName, query, update } = req.body;
    if (!collectionName || !query || !update)
      return res
        .status(400)
        .json({ error: "Collection name, query, and update are required." });

    const parsedQuery = JSON.parse(query);
    const result = await db
      .collection(collectionName)
      .updateMany(parsedQuery, { $set: update });
    res
      .status(200)
      .json({ message: `${result.modifiedCount} documents updated.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
