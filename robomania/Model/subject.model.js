const mongoose = require("mongoose");

const Subject = new mongoose.Schema({
  subjectId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  students: Array,
  assignments: Array,
  scores: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subject", Subject);
