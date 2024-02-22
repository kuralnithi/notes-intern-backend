const rdsCon = require("../Database/db.config");
const { Task } = require("../Models/Task.Schema");
const { sendMail, updateMail, deleteMail } = require("../Services/nodeMailer");

exports.addNote = async (req, res) => {
  const { id, content1, content2 } = req.body.noteData;
  console.log(id, content1, content2);

  rdsCon().getConnection((err, connection) => {
    if (err) throw err;

    console.log("connection established");

    connection.query(
      "INSERT INTO notes VALUES(?,?,?)",
      [id, content1, content2],
      (err, row) => {
        connection.release();

        if (err)
          res.status(500).json({ message: "erro in adding notes", data: row });

        console.log("row inserted", row);

        connection.query("SELECT * FROM notes", (err, row) => {
          if (err) {
            res
              .status(500)
              .json({ message: "error in getting rows", data: row });
            console.log("all rows returned", row);
          }
          res
            .status(200)
            .json({ message: "all notes returned successfully", data: row });
        });
      }
    );
  });
};
exports.getNote = async (req, res) => {
  rdsCon().getConnection((err, connection) => {
    if (err) throw err;

    console.log("connection established");

    connection.query("SELECT * FROM notes", (err, row) => {
      connection.release();

      if (err) throw err;
      console.log("all rows returned", row);
      res
        .status(200)
        .json({ message: "all notes returned successfully", data: row });
    });
  });
};
exports.editNote = async (req, res) => {
  const { id, Econtent1, Econtent2 } = req.body.noteData;
  console.log(id, Econtent1, Econtent2);
  rdsCon().getConnection((err, connection) => {
    if (err) throw err;

    console.log("connection established");

    connection.query(
      `UPDATE notes SET content1=?,content2=? WHERE id=?`,
      [Econtent1, Econtent2, id],
      (err, row) => {
        connection.release();

        if (err)
          return res
            .status(500)
            .json({ message: "error in editing rows", data: row });
        console.log("row updated", row);

        connection.query("SELECT * FROM notes", (err, row) => {
          if (err)
            return res
              .status(500)
              .json({ message: "error in getting rows", data: row });
          console.log("all rows returned", row);
          res
            .status(200)
            .json({ message: "all notes returned successfully", data: row });
        });
      }
    );
  });
};
exports.deleteNote = async (req, res) => {
  const { id } = req.body;
  console.log("id", id);
  rdsCon().getConnection((err, connection) => {
    if (err) throw err;

    console.log("connection established");

    connection.query(`DELETE FROM notes WHERE id = ? `, [id], (err, row) => {
      connection.release();

      if (err)
        res.status(500).json({ message: "error in deleting notes", data: row });

      console.log("row deleted", row);

      connection.query("SELECT * FROM notes", (err, row) => {
        if (err)
          res.status(500).json({ message: "error in getting rows", data: row });
        console.log("all rows returned", row);
        res
          .status(200)
          .json({ message: "all notes returned successfully", data: row });
      });
    });
  });
};

exports.addTask = async (req, res) => {
  try {
    const { id, title, text, completed, taskdate, time, userid, emailid } =
      req.body.taskData;
    console.log(req.body);

    const newTask = await Task.create({
      id,
      title,
      text,
      completed,
      taskdate,
      time,
      userid,
      emailid,
    });
    await newTask.save();

    if (!newTask) {
      return res.status(500).json({ message: "Error in adding task" });
    }
    const taskList = await Task.find({ emailid: emailid });
    console.log(taskList);

    sendMail(emailid,title,text,taskdate,time);

    return res
      .status(200)
      .json({ message: "Task added successfully", data: taskList });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Error in adding task" });
  }
};

exports.getTask = async (req, res) => {
  try {
    console.log(req.body);

    const { emailid } = req.body.taskData;
    const taskList = await Task.find({ emailid: emailid });

    if (!taskList) {
      return res.status(500).json({ message: "Error in getting task" });
    }

    return res
      .status(200)
      .json({ message: "Task returned successfully", data: taskList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in getting task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id, completed, emailid, title, text, taskdate, time } =
      req.body.taskData;

    const updatedTask = await Task.updateOne(
      { id: id },
      { $set: req.body.taskData },
      { upsert: true, new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const taskList = await Task.find({ emailid: emailid });
    console.log(taskList);

    updateMail(emailid,title,text,taskdate,time);

    res
      .status(200)
      .json({ message: "Task successfully updated", data: taskList });

    console.log("reqqqqqq>>", req.body);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Task not found" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id, emailid } = req.body.taskData;

    console.log("del requestttttttttttt",req.body);

    const deletedTask = await Task.deleteOne({ id: id });

    console.log(deletedTask);
    if (deletedTask.deletedCount == 0) {
      console.log(deletedTask);
      return res.status(500).json({ message: "task not deleted successfully" });
    }

    const taskList = await Task.find({ emailid: emailid });
    deleteMail(emailid);

    return res.json({
      message: "task deleted successfully",
      data: taskList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "task not deleted successfully" });
  }
};
