const express = require('express');
const app = express();
const DBConnection = require("./database/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");


DBConnection();

app.get("/", (req, res) => {
    res.send("<h1>Hello, World!</h1>");
});

app.post("/register", async (req, res) => {
    try {
        //get all the data from frontend
    const { username, email, password } = req.body;

    //check that all the data exist
    if(!(username && email && password)){
        return req.statusCode(400).send("Please enter all the details");
    }

    //check if the user already exist
    const existingUSer = await User.findOne({email});
    if(existingUSer){
        return res.status(400).send("User already exist");
    }

    //hashing/encrypt the password
    const hashpassword = await bcrypt.hash(password, 10);

    //save the user in db
    const user = await User.create({
        username,
        email,
        password: hashpassword,
    });
    //generate a token for user and send it
    const token=jwt.sign({id: user.id, email}, process.env.SECRET_KEY, {
        expireIN: '1h',
    });
    user.token = token;
    user.password = undefined;
    res.status(200).json({message: 'You have successfully registered!', user});
    } catch (error) {
        console.log(error);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}!`);
});
