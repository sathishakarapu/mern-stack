const mongoose = require("mongoose");
const userModel = require("./userModel");

const employeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    courses: {
      type: [String],
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel.modelName,
      required: true,
    },
  },
  { timestamps: true }
);

const employeModel = mongoose.model("Employe", employeSchema);

module.exports = employeModel;
