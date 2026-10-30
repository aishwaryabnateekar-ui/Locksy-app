require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "10kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", apiLimiter);

// Authentication routes
app.use("/api/auth", require("./routes/auth"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "LOCKSY backend is running."
  });
});

// Not found
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found."
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  res.status(500).json({
    message: "Something went wrong."
  });
});

// Start server after database connection
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      throw new Error("MONGODB_URI and JWT_SECRET must be configured.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("LOCKSY MongoDB connected.");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`LOCKSY server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Could not start LOCKSY:", error.message);
    process.exit(1);
  }
};

startServer();
