
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// Allow requests from the LOCKSY frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

// Parse JSON requests
app.use(express.json({ limit: "1mb" }));

// Basic API rate limiting
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later."
    }
  })
);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to LOCKSY API",
    version: "1.0.0"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "LOCKSY API is running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("LOCKSY database connected");

    app.listen(PORT, () => {
      console.log(`LOCKSY server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start LOCKSY:", error.message);
    process.exit(1);
  }
}

startServer();
