const express = require("express");
const {
  addTask,
  updateTask,
  deleteTask,
  getTask,
} = require("../Controllers/notes.controller");

const router = express.Router();

router.post("/addtask", addTask);
router.post("/gettask", getTask);
router.post("/updatetask", updateTask);
router.post("/deletetask", deleteTask);

module.exports = router;
