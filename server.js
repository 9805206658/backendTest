require('dotenv').config(); // Load .env file
// import the alll the module;
// const connectDB =require('./db');
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const app=express();
const port=process.env.PORT;

// mongodb module;
const connectDb = require('./db');
const userRouter = require('./routes/userRoutes');
app.use(userRouter);
// middleware
app.use(express.json());
fs=require('fs');
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
connectDb();



// app.post('/student', async (req, res) => {
//     try {
//         const newUser = new Student(req.body);
//         await newUser.save();
//         res.status(201).json(newUser);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

//listen
app.listen(port,()=>
{console.log(`server runing on port ${port}`);
});


