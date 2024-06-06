const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require('../database/Database');

const loginController = async (req, res) => {
    console.log('Request body:', req.body);
    const { email, password } = req.body;

    try {
        if (!(email && password))
            return res.status(400).json({ error: 'Please enter all required fields.'});

        const existingUser = await User.findOneUser({ email });
    
        if (!existingUser)
            return res.status(401).json({ error: "User doesn't exist" });

        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!passwordCorrect)
            return res.status(401).json({ error: `Wrong password.` });
        
        const token = jwt.sign(
            {
                user: existingUser._id,
            },
            process.env.SECRET_KEY
        );

        res.cookie("token", token, {
            httpOnly: true,
        }).status(200).json({ message: "Logged In" });
        
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ error: "server error" });
    }

}

const registerController = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // save a new user account to the db
        const savedUser = await User.createNewUser({ name, username, email, password: passwordHash});

        // sign the token
        const token = jwt.sign(
            {
                user: savedUser._id,
            },
            process.env.SECRET_KEY
        );

        // send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
        }).status(200).json({ msg: "Registered" });
    } catch (err) {
        
        res.status(500).json({ error: err });
    }
}

const logoutController = (req, res) => {
    return res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        // secure: true,
        // sameSite: "none",
    }).status(200).json({ msg: "Logged Out" });
}

const loggedInController = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.token) return res.json(false);

        const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.getUserById(verified.user);

        res.status(200).json({
            status: true,
            name: user.name,
            email: user.email,
            username: user.username,
            solvedQuestions: user.solvedQuestions
        });
    } catch (err) {
        
        res.json({ err});
    }
}

const changePasswordController = async (req, res) => {
    try {
        let { username, email, password, newPassword } = req.body;
        username = username ? username.trim() : '';
        email = email ? email.trim() : '';

        const existingUser = await User.findOneUser({ username, email });
        if (!existingUser || (existingUser.username !== username) || (existingUser.email !== email))
            return res.status(401).json({ error: 'Wrong email or username or password.' });
        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.passwordHash
        );
        if (!passwordCorrect)
            return res.status(401).json({ error: 'Wrong email or username or password.' });

        // hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);
        existingUser.passwordHash = passwordHash;
        await existingUser.save();
        res.status(200).json({ msg: "Password Changed" });
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        res.status(500).json({ error });
    }
}

module.exports = {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    changePasswordController
};