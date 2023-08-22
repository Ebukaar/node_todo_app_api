const router = require("express").Router();
const Todo = require("../models/Todo");
const verifyToken = require("../middleware/verifyToken");

router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    //We will only fetch todos associated with the logged in user
  const userTodos = await Todo.find({ user: req.user.userId })
                              .populate('user', 'username email _id')
                              .exec();

  // Return the todo as JSON
  res.json({ todos: userTodos });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error"});
  }
});

module.exports = router;
