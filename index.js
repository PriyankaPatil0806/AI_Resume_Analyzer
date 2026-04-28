const express = require('express');
const  cors = require('cors');
require("dotenv").config();

const app = express();
const PORT = 4000;
const path = require('path');

require('./conn');
app.use(express.json()); // ✅ must
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials:true,
    origin:true,
}))
const UserRoutes = require('./Routes/user');
const ResumeRoutes = require('./Routes/resume');


app.use('/api',UserRoutes);
app.use('/api/resume',ResumeRoutes);

app.use(express.static(path.join(__dirname,"build")));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"build","index.html"));
});

app.listen(PORT,()=>{
    console.log("backend is running on port",PORT);
})