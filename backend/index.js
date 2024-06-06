const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { DBConnection } = require("./database/db");
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const compilerRoutes = require('./routes/compilerRoutes');
const submitRoutes = require('./routes/submitRoutes');


const app = express();


DBConnection();


const corsOptions = {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  };
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', authRoutes);
app.use('/problems', problemRoutes);
app.use('/run', compilerRoutes);
app.use('/submit', submitRoutes);

// Error handling middleware (move to the end)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
});


