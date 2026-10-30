
const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const router = express.Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

function createToken(user) {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken || typeof idToken !== "string") {
      return res.status(400).json({
        message: "Google ID token is required."
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      payload.email_verified !== true
    ) {
      return res.status(401).json({
        message: "Google account verification failed."
      });
    }

    const googleId = payload.sub;
    const email = payload.email.trim().toLowerCase();

    let user = await User.findOne({ googleId });

    // Automatically create an account for a new Google user.
    if (!user) {
      const existingUser = await User.findOne({ email });

      // Do not silently link an existing account.
      if (existingUser) {
        return res.status(409).json({
          message:
            "An account with this email already exists. Please sign in using your existing method."
        });
      }

      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId,
        profilePicture: payload.picture || "",
        authProvider: "google"
      });
    } else {
      let updated = false;

      if (payload.name && user.name !== payload.name) {
        user.name = payload.name;
        updated = true;
      }

      if (
        payload.picture &&
        user.profilePicture !== payload.picture
      ) {
        user.profilePicture = payload.picture;
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    }

    return res.status(200).json({
      message: "Google sign-in successful.",
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error("Google authentication error:", error.message);

    return res.status(401).json({
      message: "Google sign-in could not be verified. Please try again."
    });
  }
});

module.exports = router;
