const express = require('express');
const {generateFile} = require('./generateFile')
const app = express();
const {executeCpp} = require('./executeCpp')
const cors = require('cors');

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));


app.get('/', (req, res) => {
    res.send("Hello!");
})

app.post('/run', async (req, res) => {
    const {language = 'cpp', code} = req.body;
    if(code === undefined) {
        return res.status(500).json({success: false, error: "Empty code body!"});
    }

    try {
        const filePath = generateFile(language, code);
        const output = await executeCpp(filePath);
        res.json({ filePath, output });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    } 
});

app.listen(8000, ()=>{
    console.log("Server is listening on prot 8000!")
});