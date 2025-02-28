require('dotenv').config(); // Load .env file
// import the alll the module;
// const connectDB =require('./db');
const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors({
    origin: '*', // Allow all origins (for testing)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

const bodyParser=require('body-parser');
const port=process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongodb module;
const connectDb = require('./db');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const carRouter = require('./routes/cartRoutes');
connectDb();
// here using all route
app.use(userRouter);
app.use(productRouter);
app.use(carRouter);
// middleware
app.use(express.json());

//listen
app.listen(port,()=>
{console.log(`server runing on port ${port}`);
});