const express = require("express");
const {
  addNote,
  editNote,
  deleteNote,
  getNote,
} = require("../Controllers/notes.controller");

const router = express.Router();

router.post("/addnote", addNote);
router.get("/getnote", getNote);
router.post("/editnote", editNote);
router.post("/deletenote", deleteNote);

module.exports = router;
