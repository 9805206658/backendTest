const express = require('express');
const userRouter = express.Router();

const {loginUser} = require("../middlewares/authenticationToken");
const { createUser,getUser,updateUser,deleteUser,upload,getProfilePicture } = require('../models/user');
// const router = require('../models/test');
userRouter.post('/createUser',createUser);
userRouter.post('/getUser', getUser);
userRouter.put('/updateUser/:userId',updateUser);//take userId as variable
userRouter.delete('/deleteUser/:userId',deleteUser);
userRouter.delete('/')
// here making the path for the creating 
userRouter.post("/uploads",upload.single("file"),(req,res)=>{
    if(req.file)
    {
    res.status(200).json({message:"file uploaded successfully"});
    }
    else{
        res.status(400).json({ message: "No file uploaded" });
    }
});
// here creating router for getting the profile picture
userRouter.get("/getProfilePicture/:userId",getProfilePicture);
userRouter.post("/loginUser",loginUser);
module.exports = userRouter;