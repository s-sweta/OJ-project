const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require('./database/Database');


const registerValidator = async (req, res, next) => {

    let { name, username, email, password, passwordVerify } = req.body;

    name = name ? name.trim() : '';
    username = username ? username.trim() : '';

    try {
        if (!name || !username || !email || !password || !passwordVerify)
            return res.status(400).json({
                error: `Please enter all required fields.  Missing :${!name ? ' name' : ''}${!username ? ' username' : ''}${!email ? ' email' : ''}${!password ? ' password' : ''}${!passwordVerify ? ' passwordVerify' : ''}`
            });

        if (name.length >= 10)
            return res.status(400).json({
                error: "Name should be less that 10 characters"
            });

        if (username.length >= 10 || username.length < 4)
            return res.status(400).json({
                error: "Username should be less that 10 characters and greater than or equal to 4 characters"
            });

        if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)))
            return res.status(400).json({
                error: "Email is not valid"
            });

        if (password.length < 6)
            return res.status(400).json({
                error: "Please enter a password of at least 6 characters.",
            });

        if (password !== passwordVerify)
            return res.status(400).json({
                error: "Please enter the same password twice.",
            });

        

        const existingUserE = await User.findOneUser({ email });
        if (existingUserE)
            return res.status(400).json({
                error: "An account with this email already exists.",
            });

        const existingUserU = await User.findOneUser({ username });
        if (existingUserU)
            return res.status(400).json({
                error: "An account with this username already exists.",
            });

        next();
    } catch (err) {
        
        res.status(500).json({ error: "Internal Error" });
    }
}

const authValidator = (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log(token);
        if (!token) {
          console.log("token not found 1");
          return res.status(404).json({
            success: false,
            message: "User authentication failed",
          });
        }
        jwt.verify(token, process.env.SECRET_KEY, async (error, data) => {
          if (error) {
            return res
              .status(404)
              .json({ success: false, message: "User authentication failed" });
          } else {
            const user = await User.getUserById(data.id);
            if (user) {
              // console.log(user.firstname);
              return res.status(200).json({ success: true, user: user});
            } else
              return res
                .status(404)
                .json({ success: false, message: "User authentication failed" });
          }
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
}

const authProvider = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) new Error("Unauthorized");

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;
        req.username = verified.username;

    } catch (err) {
        req.user = undefined;
        req.username = 'guest';
    }

    next();
}



module.exports = {
    registerValidator,
    authValidator, authProvider,
};