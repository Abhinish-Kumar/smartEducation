const Student = require("../../Model/student.model");
const Subject = require("./../../Model/subject.model");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
app.use(cookieParser());

// Student Registration
exports.registerStudent = async (req, res) => {
  try {
    let { name, email, password, regId } = req.body;

    let newStudent = new Student({
      name,
      email,
      password,
      regId,
      // date is automatically added by default
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      data: newStudent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Student Login
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body; // Changed to use email instead of name
    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Simple password check (without encryption)
    if (student.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set cookie with student information
    res.cookie(
      "studentAuth",
      JSON.stringify({
        id: student._id,
        name: student.name,
        email: student.email,
        role: "student",
        regId: student.regId,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      }
    );

    // Return student data (excluding password)
    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      message: "Login successful",
      user: studentData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Student Profile
exports.getStudentProfile = async (req, res) => {
  try {
    // Check if student is authenticated via cookie
    if (!req.cookies.studentAuth) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Parse and validate cookie data
    let authData;
    try {
      authData = JSON.parse(req.cookies.studentAuth);
      if (!authData?.id || !authData?.email) {
        throw new Error("Invalid auth data");
      }
    } catch (parseError) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication data",
      });
    }

    // Verify student exists
    const student = await Student.findById(authData.id);
    if (!student) {
      // Clear invalid cookie
      res.clearCookie("studentAuth");
      return res.status(401).json({
        success: false,
        message: "Student not found",
      });
    }

    // Verify cookie email matches student record
    if (student.email !== authData.email) {
      res.clearCookie("studentAuth");
      return res.status(401).json({
        success: false,
        message: "Authentication mismatch",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};

// Student Logout
exports.logoutStudent = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("studentAuth", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Optional: Add logout tracking in database if needed
    // await Student.findByIdAndUpdate(req.user.id, { lastLogout: new Date() });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: error.message,
    });
  }
};

// Add this to your student.controller.js
exports.enrollInSubject = async (req, res) => {
  try {
    // Check authentication
    if (!req.cookies.studentAuth) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const authData = JSON.parse(req.cookies.studentAuth);
    const { subjectId } = req.body;

    if (!subjectId) {
      return res
        .status(400)
        .json({ success: false, message: "Subject ID is required" });
    }

    // Find the subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    // Check if student is already enrolled
    if (subject.students.includes(authData.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled in this subject" });
    }

    // Add student to subject
    subject.students.push(authData.id);
    await subject.save();

    // Add subject to student's enrolledSubjects (if you have this field)
    await Student.findByIdAndUpdate(authData.id, {
      $addToSet: { enrolledSubjects: subjectId },
    });

    res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      subject: {
        _id: subject._id,
        name: subject.name,
        subjectId: subject.subjectId,
        teacher: subject.teacher,
      },
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during enrollment",
      error: error.message,
    });
  }
};

// Get all subjects without any filtering
exports.getAllSubjects = async (req, res) => {
  try {
    // 1. Check authentication (optional - remove if you want public access)
    if (!req.cookies.studentAuth) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // 2. Find all subjects without any filters
    const allSubjects = await Subject.find({}) // Empty query returns all
      .select("-students -__v") // Exclude unnecessary fields
      .populate("teacher", "name email") // Include teacher info
      .sort({ name: 1 }); // Sort alphabetically

    // 3. Return all subjects
    res.status(200).json({
      success: true,
      count: allSubjects.length,
      data: allSubjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subjects",
      error: error.message,
    });
  }
};
