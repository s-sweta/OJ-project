const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { DBConnection } = require("./database/db");
const cookieParser = require('cookie-parser')

const app = express();

// Set up database connection
DBConnection();

// Enable CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/problems', require('./routes/problemRoutes')); // Add '/problems' prefix

// Error handling middleware (move to the end)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}!`);
});

