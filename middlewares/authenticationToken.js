const db = require('../db');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const user = require('../models/user');
const jwtSecret =process.env.JWT_SECRET ;
const loginUser = async(req,res)=>{
    const {phone,password,userType} = req.body;
    try{
        //  here reading data  by the cont
        const user = await User.findOne({phone:phone,userType:userType});
        if(!user){
            return res.status(400).json({message:"mobile number are not register"});
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
        userType:user.userType
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

// here checking the authntication token 
const authntication =(req,res,next)=>{
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(token);
  if(!token)
  {
    return res.status(401).json({error:"access denied no token is providied"});
  }
  try{
    // here verify toekn
    if(jwt.verify(token,jwtSecret,(err,user)=>{
      if(err)
      {
        console.log(err);
        return res.status(403).json({error:"token expired or inavlid please login again "});
      }
      else{
        if(req.route.path === "/tokenChecker"){
          return res.status(200).json({error:"token is valid please login again"});
        }
      }
    
     req.user = user;
    
     next ();
    }));
  }
  catch(err)
  {
    console.log(err);
    return res.status(403).json({error:"invalid or expired token please login again"});
  }
  

  }





module.exports={
    loginUser,
    authntication,
}