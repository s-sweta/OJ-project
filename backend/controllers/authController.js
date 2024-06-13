const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "1h" });
};

const setTokenCookie = (res, token) => {
    const options = {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
    };
    res.cookie("token", token, options);
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        user.token = token;
        user.password = undefined;

        setTokenCookie(res, token);
        res.status(200).json({ success: true, message: "Successfully logged in", token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const registerController = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        if (!(name && username && email && password)) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.createNewUser({ name, username, email, password: passwordHash });

        const token = generateToken(newUser._id);
        newUser.token = token;
        newUser.password = undefined;

        setTokenCookie(res, token);
        res.status(201).json({ success: true, message: "Successfully registered", token, newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const logoutController = (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) })
        .status(200).json({ success: true, message: "Logged out" });
};

const loggedInController = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ success: false, user: null });

        const verified = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(verified.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                password: undefined,
                solvedQuestions: user.solvedQuestions,
                totalSubmission: user.totalSubmissions
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const changePasswordController = async (req, res) => {
    try {
        const { username, email, password, newPassword } = req.body;

        const user = await User.findOne( {username, email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.password = passwordHash;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    changePasswordController
};