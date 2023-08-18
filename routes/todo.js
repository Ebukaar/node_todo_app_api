const router = require("express").Router();
const Todo = require("../models/Todo");
const verifyToken = require("../middleware/verifyToken");

// routes
router
  .post("/add/todo", verifyToken, (req, res) => {
    // const todo = req.body.todo // We can do it like this or we use the destructuring way below.
    const { todo } = req.body;
    const newTodo = new Todo({
      todo,
      user: req.user.userId // We are attaching the user's id to the todo
    });

    // save the todo
    newTodo
      .save()
      .then(() => {
        res.json({ success: true, msg: "Successfully added todo!" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, msg: "Error adding todo" });
      });
  })

  .delete("/delete/todo/:_id", verifyToken, (req, res) => {
  const { _id } = req.params;
  // To ensure that the user is the one deleting the todo. 
  Todo.deleteOne({ _id, user: req.user.userId })
    .then(() => {
      res.json({ success: true, msg: "Deleted Todo Successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, msg: "Error deleting todo" });
    });
})

  .post("/update/todo/:_id", verifyToken, (req, res) => {
    const { _id } = req.params;
    const { todo } = req.body;
    // To ensure the user is the one updating the code
    Todo.findByIdAndUpdate({ _id, user: req.user.userId }, { todo }, { new: true })
      .then(() => {
        res.json({ success: true, msg: "Updated Todo Successfully" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, msg: "Error updating todo" });
      });
  });

module.exports = router;
