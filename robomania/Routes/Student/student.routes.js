const express = require("express");
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  logoutStudent,
  enrollInSubject,
  getAllSubjects,
} = require("./student.controller");

const student = express.Router();

student.post("/student/register", registerStudent);
student.post("/student/login", loginStudent);
student.get("/student/profile", getStudentProfile);
student.post("/student/logout", logoutStudent);
// Add this to your student routes
student.post("/student/enroll", enrollInSubject);
student.get("/students/all", getAllSubjects);
// teacher.post("/course", createNewCourse);

module.exports = student;
