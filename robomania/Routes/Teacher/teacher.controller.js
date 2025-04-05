const UserSchema = require("./../../Model/teacher.model.js");
const Subject = require("./../../Model/subject.model.js");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
app.use(cookieParser());
exports.registerTeacher = async (req, res) => {
  try {
    let { name, email, password, regNo } = req.body;
    let newTeacher = new UserSchema({
      name,
      email,
      password,
      regNo,
    });

    await newTeacher.save();

    res.status(201).json({
      success: true,
      data: newTeacher,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.loginTeacher = async (req, res) => {
  try {
    const { name, password } = req.body;
    // Find user by name
    const user = await UserSchema.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Simple password check (without encryption)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set cookie with user information
    res.cookie(
      "teacherAuth",
      JSON.stringify({
        id: user._id,
        name: user.name,
        role: "teacher",
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      }
    );

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
exports.logoutTeacher = async (req, res) => {
  try {
    res.clearCookie("teacherAuth");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error during logout",
    });
  }
};

// Subject Management Controllers
exports.createSubject = async (req, res) => {
  try {
    const teacherAuth = req.cookies.teacherAuth;
    console.log(req.cookies);
    if (!teacherAuth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const teacher = JSON.parse(teacherAuth);
    const { name, subjectId } = req.body;

    if (!name || !subjectId) {
      return res.status(400).json({
        success: false,
        error: "Subject name and ID are required",
      });
    }

    const existingSubject = await Subject.findOne({
      $or: [{ subjectId }, { name, teacher: teacher.name }],
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        error: "Subject with this ID or name already exists",
      });
    }

    const newSubject = new Subject({
      subjectId,
      name,
      teacher: teacher.name,
      students: [],
      assignments: [],
      scores: [],
    });

    await newSubject.save();

    res.status(201).json({
      success: true,
      data: newSubject,
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error while creating subject",
    });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const teacherAuth = req.cookies.teacherAuth;
    if (!teacherAuth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const teacher = JSON.parse(teacherAuth);
    const subjects = await Subject.find({ teacher: teacher.name });

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error while fetching subjects",
    });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const teacherAuth = req.cookies.teacherAuth;
    console.log(req.cookies);
    if (!teacherAuth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { id } = req.params;
    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error while fetching subject",
    });
  }
};

exports.createAssignment = async (req, res) => {
  console.log(req.body);
  try {
    const teacherAuth = req.cookies.teacherAuth;
    if (!teacherAuth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const teacher = JSON.parse(teacherAuth);
    const { subjectId, title, dueDate, questions, type } = req.body;

    // Validate required fields
    if (!subjectId || !title || !questions || !type) {
      return res.status(400).json({
        success: false,
        error: "Subject ID, title, questions, and type are required",
      });
    }

    // Validate at least one question
    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one question is required",
      });
    }

    // Validate each question
    for (const [index, question] of questions.entries()) {
      if (!question.text || question.text.trim() === "") {
        return res.status(400).json({
          success: false,
          error: `Question ${index + 1} text cannot be empty`,
        });
      }

      if (question.options.length < 2) {
        return res.status(400).json({
          success: false,
          error: `Question ${index + 1} must have at least 2 options`,
        });
      }

      if (question.options.some((opt) => !opt.trim())) {
        return res.status(400).json({
          success: false,
          error: `Question ${index + 1} has empty options`,
        });
      }

      if (
        question.correctOption === undefined ||
        question.correctOption === null
      ) {
        return res.status(400).json({
          success: false,
          error: `Question ${index + 1} must have a correct option selected`,
        });
      }

      if (!question.marks || question.marks < 1) {
        return res.status(400).json({
          success: false,
          error: `Question ${index + 1} must have at least 1 mark`,
        });
      }
    }

    // Find the subject
    const subject = await Subject.findOne({ _id: subjectId });
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    // Check if teacher owns the subject
    if (subject.teacher !== teacher.name) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to create assignments for this subject",
      });
    }

    // Create the new assignment
    const newAssignment = {
      title,
      type,
      dueDate: dueDate || null,
      questions,
      createdAt: new Date(),
      totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
    };

    // Add to subject's assignments
    subject.assignments.push(newAssignment);
    await subject.save();

    res.status(201).json({
      success: true,
      data: newAssignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error while creating assignment",
    });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const teacherAuth = req.cookies.teacherAuth;
    if (!teacherAuth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { id } = req.params;
    const { name, subjectId } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { name, subjectId },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedSubject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error while updating subject",
    });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const teacherAuth = req.cookies.teacherAuth;
    if (!teacherAuth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { id } = req.params;
    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error while deleting subject",
    });
  }
};

// Teacher Profile Controller
exports.teacherProfile = async (req, res) => {
  try {
    const teacherAuth = req.cookies.teacherAuth;
    if (!teacherAuth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const teacher = JSON.parse(teacherAuth);
    const teacherData = await UserSchema.findById(teacher.id).select(
      "-password"
    );

    if (!teacherData) {
      return res.status(404).json({
        success: false,
        error: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      data: teacherData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error while fetching teacher profile",
    });
  }
};
