const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken")
require("dotenv").config();

// The routes below handle submission of login and signup data
router.post(
  "/signup",
  [
    check("username").isLength({ min: 4 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        username,
        email,
        password: await bcrypt.hash(password, 10),
      });

      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send the token in the JSON response
      res.status(201).json({ msg: "Signup successful!", token });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    try {
      user.lastLoggedIn = new Date();
      await user.save();
    } catch (timestampError) {
      console.error("Error updating login timestamp:", timestampError.message);
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token in a cookie
    res.cookie("authToken", token, { httpOnly: true, maxAge: 3600000 });

    //Send the token in json response
    res.status(200).json({
      msg: "Login successful!",
      token,
      lastLoggedIn: user.lastLoggedIn,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// To log out
// Logout route ( logging out simply informs the client to delete the token)
router.get("/logout", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.lastLoggedOut = new Date();
    await user.save();

    res
    .cookie("authToken", "", { expires: new Date(0) })
    .json({
      msg: "Logged out successfully. Client should delete the token.",
      lastLoggedOut: user.lastLoggedOut,
    });
    
  } catch (timestampError) {
    console.error("Error updating logout timestamp:", timestampError.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
