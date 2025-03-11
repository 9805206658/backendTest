
const mongoose  = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Types.ObjectId,required: true,ref:'User' },
  brand: { type: String, required: true },
  frameMaterial: { type: String, required: true },
  weight: { type: Number, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required:true},  
  warrentyPeriod: { type: Number, required: false },
  imageName: { type: [String], required: true },
  status: { type: String, enum: ["active", "inactive"],default:"active" },
  uploadAt : {type:Date,default:Date.now()},
  quantity:{type:Number,required:true}
});

// here making product model
const directoryPath = path.join(__dirname,'productImage');
const Product= mongoose.model("Product",productSchema);
// creating the directory
if(!fs.existsSync(directoryPath))
{
  fs.mkdirSync(directoryPath,{recursive:true});
  console.log("Directory is create"+directoryPath);
}

// here setting multerstorae 
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
     cb(null,directoryPath);
  }
  ,
  filename:(req,file,cb)=>{
    console.log(file);
    cb(null,`${file.originalname}`) 

  }
})


// here defining the middleware 
const uploadPhoto =async(req,res,next)=>{
  // abstract files and other datra
  try{
    console.log("enter");
   console.log(req.files);
   console.log(req.body.subData)
       if(!req.body.subData)
       {
         res.status(400).json({message:"missing product data(subdata)"});
       }
      req.body.subData = JSON.parse(req.body.subData);
      
     next ();
      }
      catch(err)
      {
        console.log(err);
        res.status(500).json({error:"error processing image"});
      }
}

// here creating multer instance 

const createProduct = async(req,res)=>{
 const {quantity} = req.body.subData
  try{ 
    const productInfo = req.body.subData;
    console.log(productInfo);
    // here creating the array product 
    if(quantity <= 0)
    {
      return res.status(401).json({message:"the quntity mus be greater than zero"});
    }
    const products  = [];
    for(let i = 0; i < quantity; i++)
    {
      products[i] =  new Product(productInfo);
    }
    const savedProduct = await Product.insertMany(products);
    res.status(200).json({message:"Product are succefully added",user:savedProduct});
  }
  catch(err)
  { 
    console.log(err);
    res.status(500).json({message:err.message});
   }
};


// api give single product info or all product info
const getProduct = async(req,res)=>
{
  console.log("enter get product");
  console.log(req.params);
  try{
    const {checkAll,productId} = req.params;
    console.log(typeof checkAll);
    console.log(checkAll);
    console.log(productId);
    if(checkAll == "true")
    { 
      console.log("enter");
    return res.status(200).json({message:await Product.find()});
    }
    else{
      return res.status(200).json({message:await Product.findById(productId)});
    }
   
  }
  catch(err)
  {res.status(500).json({message:err.message});
  }
}

const updateProduct=async(req,res)=>{
  try{
    const {productId} = req.params;
    const productInfo = req.body;
    if(!productInfo)
     {res.status(400).json({message:"update product information are required"}); }
    const updateProduct  = await Product.findByIdAndUpdate(productId,productInfo,{new:true,runValidators:true});
    if(!updateProduct)
    {
      return res.status(400).json({message:'the product with given id not found'});
    }
    res.status(200).json({message:updateProduct});

}
  catch(err)
  {
    res.status(500).json({error:err.message});
  }
  }

  // delete proudct
const deleteProduct =async(req,res)=>
  {try
    {
     const{productId}= req.params;
     if(!ObjectId.isValid(productId))
       {return res.status(400).json({error:"invalid product id"});}
       const result = await Product.deleteOne({ _id:new ObjectId(productId)});
     if (result.deletedCount == 0)
      {return res.status(404).json({message: "Product not found or not authorized to delete" }); }
       return res.status(404).json({message: "Product deleted successfully"});
   }
    catch(err)
    { res.status(400).json({message:err.message}); }
  }

module.exports = 
{
  Product:mongoose.model('Product',productSchema),
  upload :multer({storage}),
  createProduct,
  uploadPhoto,
  getProduct,
  updateProduct,
  deleteProduct
}


