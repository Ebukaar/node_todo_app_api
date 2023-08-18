const router = require("express").Router();
const jwt = require("jsonwebtoken");

// const Todo = require("../models/Todo");

// Routes below
// router.get("/", async (req, res) => {
//   const allTodo = await Todo.find();
//   res.render("index", {todo: allTodo});
// });

router.get("/", (req, res) => {
  //check if auth cookie exists
  const token = req.cookies.authToken;
  if (token) {
    //verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // Error means token is invalid. Return error as JSON
        return res.status(401).json({ error: "Invalid token" });
      }

      // Valid token. Return user data
      return res.json({ user });
    });
  } else {
    // No token found. Inform the user
    res.status(401).json({ message: " Token not found. Please sign in. "});
   
  }
});

module.exports = router;
