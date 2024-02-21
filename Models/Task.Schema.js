const { default: mongoose } = require("mongoose");

const TaskSchema = mongoose.Schema({
  id: String,
  title: String,
  text: String,
  completed: String,
  taskdate: String,
  time: String,
  userid: String,
  emailid: String,
});

exports.Task = mongoose.model("Task", TaskSchema);
