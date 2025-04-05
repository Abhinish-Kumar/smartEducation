const express = require("express");
const connectDB = require("./config/db");
const teacher = require("./Routes/Teacher/teacher.routes");
const student = require("./Routes/Student/student.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(cookieParser());
app.use(express.json());
// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:4000"],
  credentials: true,
  //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

connectDB();

app.use(teacher);
app.use(student);

app.listen(3300);
