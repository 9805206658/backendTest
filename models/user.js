const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {Product} = require("../models/product");
// const Product = mainModule.Product;

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
    const userInfo = req.body;
    console.log(req.body);
     // Check if email already exists
    const existingUser = await User.findOne({ email: userInfo.email });
    const existContact = await User.findOne({phone:userInfo.contactInfo});
    if(existContact)
    {return res.status(400).json({message:"Phone number is already exist"});}
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
  const newUser = new User(userInfo);
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

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
      console.log(`Deleted ${deletedProducts.deletedCount} products for user ${userId}`);
      await User.findByIdAndDelete(userId);
     return res.status(200).json({ message: "User and associated products deleted successfully" });
  
    } catch (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: err.message });
    }
  };
  
  module.exports = 
  {
    User:mongoose.model('User',userSchema),
    createUser,
    getUser,
   updateUser,
   deleteUser
  }