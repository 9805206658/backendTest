const express = require('express');
const userRouter = express.Router();

const { createUser,getUser,updateUser,deleteUser } = require('../models/user');
userRouter.post('/createUser',createUser);
userRouter.post('/getUser', getUser);
userRouter.put('/updateUser/:userId',updateUser);//take userId as variable
userRouter.delete('/deleteUser/:userId',deleteUser);
module.exports = userRouter;