const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const jwt = require("jsonwebtoken");
const Problem = require('../models/Problem');
const User = require('../models/User')

const submitSolution = async (req, res) => {
    try {
        const { problemId, userId } = req.params;
        const { language, code, verdict, isSolved } = req.body;

        const submission = new Submission({
            userId,
            problemId,
            language,
            code,
            verdict,
            isSolved,
            submissionDateTime: new Date(),
        });

        await submission.save();

        await User.findByIdAndUpdate(
            userId,
            { $inc: { totalSubmissions: 1 } },
            { new: true }
        );

        await Problem.findByIdAndUpdate(problemId, { $inc: { totalSubmissions: 1 } });

        

        res.status(200).json({ success: true, message: 'Code submitted successfully' });
    } catch (error) {
        console.error("Error submitting code:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllMySubmissions = async (req, res) => {
    const { userId } = req.params;

    // Validate userId (Optional but recommended)
    if (!userId ) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    try {
        // Find submissions by userId and populate the problemId with the title and other necessary fields
        const submissions = await Submission.find({ userId })
            .populate('problemId', 'title') // Populating problemId with its title
            .exec();

        if (!submissions.length) {
            return res.status(404).json({ success: false, error: 'No submissions found for this user' });
        }

        // Return the submissions in the response
        res.json({ success: true, submissions });
    } catch (error) {
        // Log the error for server-side debugging
        console.error('Error fetching submissions:', error);

        // Send error response to the client
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};



const getSolvedProblems = async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    try {
        // Aggregation pipeline to get the latest "Accepted" submissions per problem
        const solvedProblems = await Submission.aggregate([
            // Match submissions with "Accepted" verdict for the given userId
            { $match: { userId: new mongoose.Types.ObjectId(userId), verdict: 'Accepted' } },
            
            // Sort by problemId and submissionDateTime to get the latest one
            { $sort: { problemId: 1, submissionDateTime: -1 } },
            
            // Group by problemId to get the latest submission for each problem
            { $group: { 
                _id: "$problemId", 
                latestSubmission: { $first: "$$ROOT" }
            }},
            
            // Replace _id with the original problemId details for clarity
            { $lookup: {
                from: 'problems', // Ensure this matches the collection name in MongoDB
                localField: '_id',
                foreignField: '_id',
                as: 'problemDetails'
            }},
            
            // Unwind the problemDetails array to include it as a single object
            { $unwind: "$problemDetails" },
            
            // Project only the required fields
            { $project: {
                _id: 0, // Exclude the default _id field
                problemId: "$_id",
                title: "$problemDetails.title",
                difficulty: "$problemDetails.difficulty",
                latestSubmission: {
                    _id: "$latestSubmission._id",
                    language: "$latestSubmission.language",
                    code: "$latestSubmission.code",
                    submissionDateTime: "$latestSubmission.submissionDateTime",
                    isSolved: "$latestSubmission.isSolved"
                }
            }}
        ]);

        // Check if we found any solved problems
        if (!solvedProblems.length) {
            return res.status(404).json({ success: false, error: 'No solved problems found for this user' });
        }

        // Return the solved problems in the response
        res.json({ success: true, solvedProblems });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching solved problems:', error.message, error.stack);

        // Send error response to the client
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};





// Function to get all submissions for a specific problem
const getAllSubmissionsForProblem = async (req, res) => {
    
    const {userId, problemId } = req.params;
    const existingSubmission = await Submission.findOne({userId, problemId});
        if(!existingSubmission) {
            return res.status(400).json({success: false, error: "Please attempt the problem to view all submissions."})
        }

    try {
        const submissions = await Submission.find({ problemId }).populate('userId');
        res.json({ success: true, submissions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getUserAnalytics = async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    try {
        // Aggregation pipeline to get the unique solved problems by difficulty
        const solvedProblemsByDifficulty = await Submission.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), verdict: 'Accepted' } },
            { $sort: { problemId: 1, submissionDateTime: -1 } },
            { $group: {
                _id: "$problemId",
                latestSubmission: { $first: "$$ROOT" }
            }},
            { $lookup: {
                from: 'problems',
                localField: '_id',
                foreignField: '_id',
                as: 'problemDetails'
            }},
            { $unwind: '$problemDetails' },
            { $group: {
                _id: '$problemDetails.difficulty',
                count: { $sum: 1 }
            }},
            { $project: {
                _id: 0,
                difficulty: '$_id',
                count: 1
            }}
        ]);

        // Get total unique solved problems
        const totalSolvedProblems = await Submission.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), verdict: 'Accepted' } },
            { $group: {
                _id: "$problemId",
                latestSubmission: { $first: "$$ROOT" }
            }},
            { $count: 'totalSolvedProblems' }
        ]);

        // Format the response
        const analytics = {
            totalSolved: totalSolvedProblems[0]?.totalSolvedProblems || 0,
            easy: 0,
            medium: 0,
            hard: 0
        };

        solvedProblemsByDifficulty.forEach(d => {
            analytics[d.difficulty.toLowerCase()] = d.count;
        });

        // Return the analytics data
        res.json({ success: true, analytics });
    } catch (error) {
        console.error('Error fetching user analytics:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};



module.exports = { submitSolution, getAllMySubmissions, getSolvedProblems, getAllSubmissionsForProblem, getUserAnalytics  };
