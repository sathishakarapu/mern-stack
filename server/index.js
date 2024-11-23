const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./models/userModel");
const employeModel = require("./models/employeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const app = express();
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Please Enter All The Required Fields",
    });
  }

  const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegExp.test(email)) {
    return res.status(400).json({
      error: "Please Enter A Valid Email Address",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password Must Be Atleast 8 Characters Long",
    });
  }

  try {
    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        error: `User With Email ${email} Already Exists`,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User Registered Successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Please Enter All The Required Fields",
    });
  }

  const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegExp.test(email)) {
    return res.status(400).json({
      error: "Please Enter A Valid Email Address",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password Must Be Atleast 8 Characters Long",
    });
  }

  try {
    const userExist = await userModel.findOne({ email });

    if (!userExist) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userExist.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        error: "Invalid Email or Password!",
      });
    }

    const token = jwt.sign(
      { id: userExist._id, email: userExist.email },
      "helloworld",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login Successful",
      token: token,
      name: userExist.name,
      userId: userExist._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.post("/employees", upload.single("file"), async (req, res) => {
  const { name, email, mobile, designation, gender, courses, userId } =
    req.body;

  if (
    !email ||
    !name ||
    !mobile ||
    !designation ||
    !gender ||
    !courses ||
    !req.file ||
    !userId
  ) {
    return res.status(400).json({
      error: "Please Enter All The Required Fields",
    });
  }

  const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegExp.test(email)) {
    return res.status(400).json({
      error: "Please Enter A Valid Email Address",
    });
  }

  const mobileRegExp = /^\d{10}$/;
  if (!mobileRegExp.test(mobile)) {
    return res.status(400).json({
      error: "Mobile Number Must Be Exactly 10 Digits.",
    });
  }

  try {
    const newEmployee = new employeModel({
      name,
      email,
      mobile,
      designation,
      gender,
      courses: JSON.parse(courses),
      file: req.file.path,
      user: userId,
    });

    const employee = await newEmployee.save();

    res.status(201).json({
      message: "Employee Created Successfully",
      employee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.get("/list", async (req, res) => {
  const { userId } = req.query;

  try {
    const employeesList = await employeModel.find({ user: userId });

    if (employeesList.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    const updatedEmployeesList = employeesList.map((employee) => {
      const imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/${employee.file.replace(/\\/g, "/")}`;
      return {
        ...employee.toObject(),
        file: imageUrl,
      };
    });

    res.status(200).json({
      message: "success",
      employeesList: updatedEmployeesList,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching employee list",
      error: err.message,
    });
  }
});

app.get("/list/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await employeModel.findOne({ _id: id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const imageUrl = `${req.protocol}://${req.get(
      "host"
    )}/${employee.file.replace(/\\/g, "/")}`;
    const employeeWithFile = {
      ...employee.toObject(),
      file: imageUrl,
    };

    res.status(200).json(employeeWithFile);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching employee details",
      error: err.message,
    });
  }
});

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await employeModel.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employeModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error deleting employee", error: err.message });
  }
});

app.put("/employees/:id", upload.single("file"), async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, designation, gender, courses } = req.body;

  try {
    const employee = await employeModel.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.mobile = mobile || employee.mobile;
    employee.designation = designation || employee.designation;
    employee.gender = gender || employee.gender;

    employee.courses = Array.isArray(courses)
      ? courses
      : JSON.parse(courses) || employee.courses;

    if (req.file) {
      employee.file = req.file.path;
    }

    const updatedEmployee = await employee.save();
    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating employee", error: err.message });
  }
});

mongoose
  .connect("mongodb://localhost:27017/mern-stack")
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((err) => {
    console.log("Failed To Connect", err);
  });

app.listen(8080, () => {
  console.log("Server Running At 8080");
});
