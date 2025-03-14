require('dotenv').config(); // Load .env file
// import the alll the module
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
const cartRouter = require('./routes/cartRoutes');
const ratingRouter = require('./routes/ratingRoutes');
const path = require('path');
const paymentRouter = require('./routes/paymentRoutes');
connectDb();
// here using all route
app.use(userRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(ratingRouter);
app.use(paymentRouter);
app.use('/productImage', express.static(path.join(__dirname, '/models/productImage')));
// middleware
app.use(express.json());

// this code generate jwt secret
// const crypto = require('crypto');
// const jwtSecret = crypto.randomBytes(32).toString('hex');
// console.log(`jwtSecret:${jwtSecret}`);

app.listen(port,()=>
{console.log(`server runing on port ${port}`);
});