const jwt = require("jsonwebtoken");
const User = require('./models/User')

const registerValidator = async (req, res, next) => {
    const { name, username, email, password, passwordVerify } = req.body;

    try {
        if (!name || !username || !email || !password || !passwordVerify) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (name.length > 10) {
            return res.status(400).json({ success: false, message: "Name should be less than 10 characters" });
        }

        if (username.length > 10 || username.length < 4) {
            return res.status(400).json({ success: false, message: "Username should be between 4 and 10 characters" });
        }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password should be at least 6 characters" });
        }

        if (password !== passwordVerify) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: "Username is already taken" });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const authValidator = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied" });
        }

        jwt.verify(token, process.env.SECRET_KEY, async (error, data) => {
            if (error) {
                return res.status(401).json({ success: false, message: "Invalid token" });
            }
            const user = await User.findById(data.id);
            if (!user) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerValidator,
    authValidator
};
