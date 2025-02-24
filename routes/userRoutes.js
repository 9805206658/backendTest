// here defining the path 
// const express=require('express');
// const achivementRouter=express.Router();
// const{ insertAchivement,updateAchivement ,getAchivements,existAchivement}=require("../models/achievement");

// const { authenticateToken } = require("../middlewares/authenticateToken");

// achivementRouter.post('/insertAchivement',authenticateToken,insertAchivement);
// // achivementRouter.post('/updateAchivement',authenticateToken,updateAchivement);
// achivementRouter.get('/getAchivements/userId/:userId',authenticateToken,getAchivements);
// // achivementRouter.get('/existAchivement/achivementName/:achivementName',authenticateToken,existAchivement);
// module.exports=achivementRouter;

const express = require('express');
const bodyParser = require('body-parser');
const userRouter = express.Router();
const cors=require('cors');
// Apply body-parser middleware to userRouter
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({ extended: true }));
// Import module of the user
const { createMember, getAllMember } = require('../models/user');
// Define routes
userRouter.post('/createMember', createMember);
userRouter.get('/getAllMember', getAllMember);
module.exports = userRouter;
