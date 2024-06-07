const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require('../database/Database');

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!(email && password)) {
          return res.status(404).json({
            success: false,
            message: "All the Information are required to get login",
          });
        }
    
        const existsUser = await User.findOneUser({ email });
        if (!existsUser) {
          return res.status(404).json({
            success: false,
            message: "User doesn't get Registered",
          });
        }
    
        const enteredPass = await bcrypt.compare(password, existsUser.password);
        if (!enteredPass) {
          return res
            .status(404)
            .json({ success: false, message: "Invalid login credentials" });
        }
    
        const token = jwt.sign({ id: existsUser._id }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
    
        existsUser.token = token;
        existsUser.password = undefined;
        // console.log(token);
        const options = {
          expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
          withCredentials: true,
          httpOnly: true,
        };
    
        res.status(201).cookie("token", token, options).json({
          message: "Successfully Logged in!!",
          success: true,
          token,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }

}

const registerController = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        

        if(!(name && username && email && password)) {
            return re.status(404).json({success: flase, message: 'please enter all details'})
        }

        const user = await User.findOneUser({email});
        
        if(user){
            return res.status(404).json({success: false, message: "User already exists"});
        }
        
        // hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // save a new user account to the db
        const savedUser = await User.createNewUser({ name, username, email, password: passwordHash});

        // sign the token
        const token = jwt.sign(
            {
                user: savedUser._id,
            },
            process.env.SECRET_KEY, {
                expiresIn: "1h",
            }
        );

        savedUser.token = token;
        savedUser.password = undefined;

        const options = {
            expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.status(200).cookie("token", token, options).json({
            message: "Successfully Registered!!",
            token,
            savedUser
          });
    } catch (err) {
        
        res.status(400).json({ success: false, message: err.message });
    }
}

const logoutController = (req, res) => {
    return res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        
    }).status(200).json({ msg: "Logged Out" });
}

const loggedInController = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.token) return res.json(false);

        const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.getUserById(verified.id);

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