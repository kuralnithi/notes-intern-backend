const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const notesRouter = require("./Routers/notes.router.js");
const tasksRouter = require("./Routers/tasks.router.js");

const { ConnectDb } = require("./Database/db.config.js");
const userRouter = require("./Routers/user.router.js");

app.use(cors());
app.use(express.json());

app.use("/api", notesRouter);
app.use("/api", tasksRouter);
app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

ConnectDb();
