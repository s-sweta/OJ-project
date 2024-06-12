const mongoose = require('mongoose');
const User = require('./User');
const Problem = require('./Problem');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Problem,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    verdict: {
        type: String,
        enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
        required: true
    },
    isSolved: {
        type: Boolean,
        default: false
    },
    submissionDateTime: {
        type: Date,
        default: Date.now
    }
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;


