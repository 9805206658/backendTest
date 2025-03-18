const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// this module are use for the increaption
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Types.ObjectId;
const {Product} = require("../models/product");
// import for deleting when the user are delete
const {Cart} = require("../models/cart");
const directoryPath = path.join(__dirname,'uploads');

// Define User Schema
const userSchema = new mongoose.Schema({
  userName: { type: String,required: true},
  phone: { type: Number },
  email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] },
  password: { type: String, required: true, minlength: 8 },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  dob: { type: Date },
  userType:{type:String,enum:["Buyer","Seller"],required:true},
  status: { type: String, enum: ["Active", "Inactive"] },
  
});

// ceate model
const User = mongoose.model("User", userSchema);

// Create User Function
const createUser = async (req, res) => {
  try {
    console.log(req.body);

// "userName": "JohnDoe",
// "phone": 9876543210,
// "email": "johndoe@example.com",
// "password": "password123",
// "gender": "Male",
// "dob": "1990-05-15",
// "userType": "Buyer",
// "status": "Active",
// "contactInfo": 9876543210
// }
    const userInfo = req.body;
     userInfo.password=await bcrypt.hash(req.body.password,10);
  
    const existingUser = await User.findOne({ email: userInfo.email });
    console.log("the exist user is")
    // console.log(existingUser);
    const existContact = await User.findOne({phone:userInfo.phone});
    // console.log(existContact);
    if(existContact!=null)
    {return res.status(400).json({message:"Phone number is already exist"});}
    if (existingUser!=null) {
      return res.status(400).json({ message: "Email already registered" });
    }
  const newUser = new User(userInfo);
    const savedUser = await newUser.save();
    res.status(200).json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};


// here set up directory for uploading the profile picture
const uploadDir =path.join(__dirname,"/uploads");
// if the updload dir syncronous never move until the file creation
if(!fs.existsSync(uploadDir))
{
  fs.mkdirSync(uploadDir,{recursive:true});
console.log(`Directory crated:${uploadDir}`);
}
// set up file storage for profile picture
// here doing the multer configuration

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    fs.readdir(directoryPath,(err,files)=>{
      if(err){
        console.log(err);
        return cb(err);
      }
      files.forEach((files)=>{
        // here comparing the upload file with original file in the directory
        if(files.split(":")[1]=== file.originalname.split(':')[1])
        {
          console.log(directoryPath+`/${files}`);
          // delete existing profile picture;
          fs.unlink(directoryPath+`/${files}`,(err)=>{
            console.log(err);
          })

        }
      })


    });
  },
  filename:(req,file,cb)=>{
    console.log(file.originalname);
    cb(null,`${file.originalname}`);
  }
})
// Get User Function (Fixed `req.params` issue)
const getUser = async (req, res) => {
  try {
    console.log(req.body);
    const { userName, password } = req.body; // 🔹 Use `req.query` for URL parameters
    if (!userName || !password) {
      return res.status(400).json({ message: "Name and password are required" });
    }
    const user = await User.findOne({ userName: userName, password });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateUser = async(req,res)=>
{
  try{
  const {userId} = req.params;
  const userInfo = req.body;
  if(!userInfo)
  {return res.status(400).json({message:"user information are required"});}
   // Returns updated document and runs validation
  const updateUser =await User.findByIdAndUpdate(userId,userInfo,{ new: true, runValidators: true });
  if(!updateUser)
  {return res.status(400).json({message:'the user not found'});
  }
  res.status(400).json({message:"user successfully updated",user:updateUser}); 
  }
  catch(err)
  {res.status(500).json({error:err.message});
  }
  }
  // implementation of the on update cascade and on delete cascade
  const deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("Deleting user:", userId);
      // Validate ObjectId
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
     // Check if the user exists before attempting deletion
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
     // Delete all products associated with the user
      const deletedProducts = await Product.deleteMany({ seller_id: userId });
      // here deleting the cart of the corresponding user 
      const deletedCart= await Cart.deleteOne({ seller_id: userId });
        await User.findByIdAndDelete(userId);
     return res.status(200).json({ message: "User and associated products deleted successfully" });
  
    } catch (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: err.message });
    }
  };

  // here getting the profile picture function
 const getProfilePicture = async(req,res)=>{
    const {userId} = req.params;
    fs.readdir(directoryPath,(err,files)=>{
      if(err){
        console.log(err);
      }
      files.forEach((file)=>{
         if(new Number(files.split(":")[1])==userId)
         {
          const filePath = path.join(__dirname,'uploads',files);
          res.download(filePath);
          return 0;
         }
      })
    })
  }

  module.exports = 
  {
    User:mongoose.model('User',userSchema),
    createUser,
    upload:multer({storage}),
    getProfilePicture,
    getUser,
   updateUser,
   deleteUser
  }