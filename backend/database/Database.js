const Problem = require('../models/Problem');
const User = require('../models/User');


// Problem
const getProblemList = async () => {
    return await Problem.find({});
}
const getProblemById = async id => {
    return await Problem.findById(`${id}`);
}
const incrNoOfSubm = async quesId => {
    return await Problem.updateOne({ _id: quesId }, { $inc: { noOfSubm: 1 } });
}
const incrNoOfSuccess = async quesId => {
    return await Problem.updateOne({ _id: quesId }, { $inc: { noOfSuccess: 1 } });
}


// User
const createNewUser = async ({ name, username, email, password }) => {
    return await User.create({ name, username, email, password });
}
const getUserById = async userId => {
    return await User.findById(userId);
}
const findOneUser = async filter => {
    return await User.findOne(filter);
}
const addSolvedProblemToUser = async (username, quesId) => {
    return await User.findOneAndUpdate(
        { username },
        { $addToSet: { solvedProblems: quesId } },
        { new: true }
    );
}
const incrTotalSubmInUser = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        { $inc: { totalSubmissions: 1 } },
        { new: true }
    );
}


module.exports = {
    Problem: { getProblemList, getProblemById, incrNoOfSubm, incrNoOfSuccess },
    User: { createNewUser, getUserById, findOneUser, addSolvedProblemToUser, incrTotalSubmInUser },
   
};
