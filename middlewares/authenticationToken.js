const db = require('../db');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const user = require('../models/user');
const jwtSecret =process.env.JWT_SECRET ;
const loginUser = async(req,res)=>{
    const {phone,password} = req.body;
    console.log(req.body);
    try{
        //  here reading data  by the cont
        const user = await User.findOne({phone:phone});
        console.log(user);
        if(!user){
            return res.status(200).json({message:"mobile number are not register"});
        }
      const isMatch =await bcrypt.compare(password,user.password);
      console.log(isMatch);
      if(!isMatch)
      {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    //   here creating the payload object 
      const payload = {
        _id:user._id,
        userName:user.userName,
        phone:user.phone,
      }
    //   here generating the token
      const token = jwt.sign(payload,jwtSecret,{expiresIn:"1d"});
      return res.status(200).json({
        message:"login sucessfully",
        token,
        payload
      })

   }
    catch(err){
        console.log(err);
        res.status(500).json({message:"error while login the user "});


    }
}

module.exports={
    loginUser,
}