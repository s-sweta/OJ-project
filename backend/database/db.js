const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

module.exports = () => {
    
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connection established");
    } catch (error) {
        console.log("Error while connecting to MongoDB", error);
    }
};

