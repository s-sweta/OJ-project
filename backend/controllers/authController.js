const User = require("../models/User");
const {hashpassword, comparePassword} = require('../helpers/auth');
const jwt = require("jsonwebtoken");

const test = (req, res) => {
    res.json('test is working');
}


//register endpoint
const registerUser = async (req, res) => {
    try {
        const {name, email, password } = req.body;

        if(!(name)) {
            return res.json({
                error: 'Name is required.'
            })
        };

        if(!password || password.length < 6) {
            return res.json({
                error: 'Password should be atleast 8 characters long'
            })
        };
  
        const exist = await User.findOne({email})
        if(exist){
            return res.json({
                error: 'Email already exist.'
            })
        };

        const hashedPassword = await hashpassword(password)

        const user = await User.create({
            name, 
            email, 
            password : hashedPassword
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
};

//Login endpoint
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) {
            return res.json({
                error: 'User does not exist'
            })
        }

        const match  = await comparePassword(password, user.password)
        if(match) {
            jwt.sign({email: user.email, id: user._id, name: user.name}, process.env.SECRET_KEY, {}, (error, token) => {
                if(error) throw error;
                res.cookie('token', token).json(user)
            })
        } else {
            return res.json({
                error: 'Wrong Password'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const getProfile = (req, res) => {
    const {token} = req.cookies
    if(token) {
        jwt.verify(token, process.env.SECRET_KEY, {}, (error, user) => {
            if(error) throw error;
            res.json(user)
        })
    } else {
        res.json(null)
    }

}

const logoutUser = (req, res) => {
    res.clearCookie('token').send('Logged out successfully');
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
};