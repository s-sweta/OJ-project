const mongoose = require("mongoose");
const User = require("./User.js");

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
  input: {
    constraints: {
      type: String,
      default: null,
      trim: true,
      // required: [true, "Problem constraints is required"],
    },
    sample: {
      type: String,
      default: null,
      trim: true,
      // required: [true, "Problem sample input is required"],
    },
  },
  output: {
    constraints: {
      type: String,
      default: null,
      trim: true,
      // required: [true, "Output constraints is required"],
    },
    sample: {
      type: String,
      default: null,
      trim: true,
      // required: [true, "Problem sample output is required"],
    },
  },
  testcases: {
    input: {
      type: String,
      default: null,
      trim: true,
    },
    output: {
      type: String,
      default: null,
      trim: true,
    },
  },
  submissions: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      default: null,
      submission: [
        {
          language: {
            type: String,
            default: null,
          },
          solution: {
            type: String,
            default: null,
          },
          verdict: {
            type: String,
            default: null,
          },
          submissionDateTime: {
            type: Date,
            default: Date.now, // Example of using a function for default value
          },
          timeTaken: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  },
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt

module.exports = mongoose.model("Problem", problemsSchema);
