const express = require("express");
const {
  registerTeacher,
  loginTeacher,
  createSubject,
  getSubjects,
  createAssignment,
} = require("./teacher.controller");

const teacher = express.Router();

teacher.post("/teacher/register", registerTeacher);
teacher.post("/teacher/login", loginTeacher);
teacher.post("/teacher/subject", createSubject);
teacher.get("/teacher/subjectList", getSubjects);
teacher.get("/teacher/subjectList/:id", getSubjects);
teacher.post("/teacher/createAssignment", createAssignment);
// teacher.get("/profile", teacherProfile);

module.exports = teacher;
