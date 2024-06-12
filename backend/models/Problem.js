const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

const problemsSchema = new mongoose.Schema({
  title: {
    type: String,
    default: null,
    trim: true,
    required: [true, "Problem title is required"],
  },
  description: {
    type: String,
    default: null,
    trim: true,
    required: [true, "Problem statement is required"],
  },
  difficulty: {
    type: String,
    default: null,
    trim: true,
    required: [true, "Problem difficulty is required"],
  },
  sampleInput: {
    type: String,
    default: null,
    trim: true,
  },
  sampleOutput: {
    type: String,
    default: null,
    trim: true,
  },
  constraints: {
    type: String,
    default: null,
    trim: true,
  },
  inputFormat: {
    type: String,
    default: null,
    trim: true,
  },
  outputFormat: {
    type: String,
    default: null,
    trim: true,
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  testCases: [testCaseSchema], // Array of test cases
  }, { timestamps: true });

module.exports = mongoose.model("Problem", problemsSchema);


