

const mongoose  = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Types.ObjectId,required: true,ref:'User' },
  name:{type:String,require:true},
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
  quantity:{type:Number,required:true},
  isFlashSale:{type:Boolean,enum:[true,false],default:false},
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
     const savedProduct = new Product(productInfo);
     savedProduct.save();
        res.status(200).json({message:"Product are succefully added",user:savedProduct});
  }
  catch(err)
  { 
    console.log(err);
    res.status(500).json({error:err.message});
   }
};

const getProducts =async(req,res)=>{
    try{
        const productData = await Product.find().lean();
        const finalData=productData.map((item)=>{
          // return the image for dispaly purpose
            item.imageName = item.imageName.map((img)=>{
                return "/productImage/"+img;
            })

            return item;
        })
        console.log(finalData);

    return  res.status(200).json({"message":finalData});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({error:err});

    }
}
 
// api give single product info or all product info
const getSingleProduct = async(req,res)=>
{
  console.log("enter get product");
  console.log(req.params);
  try{
    const {productId} = req.params;
    const product = await Product.findById(productId)
    product.imageName = product.imageName.map((img)=>{
      return "/productImage/"+img;
      });
     return res.status(200).json({message:product});
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({message:err.message});
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


 const getFlashSale=async(req,res)=>{
  try{
     const data = await Product.find({isFlashSale:true});
     if(data.length >0)
     {  
       const finalData  = data.map((obj)=>{
           obj.imageName=obj.imageName.map((img)=>{
            return "/productImage/"+img;
           })
           return obj;
       })
      return res.status(200).json({message:finalData});
     }
   }
  catch(err)
   {
     return res.status(500).json({error:err});
   } 
 }


//  select the unique product on basic of the brand 
// db.products.aggregate([
//   { $group: { _id: "$brand", doc: { $first: "$$ROOT" } } },
//   { $replaceRoot: { newRoot: "$doc" } }
// ])

const getUniqueBrand =async(req,res)=>{
  try{
    console.log("brneeeh");
     const data= await Product.aggregate([
      {$group:{_id:"$brand",doc:{$first:"$$ROOT"}}},
      {$replaceRoot:{newRoot:"$doc"}}
     ]);
     if(data.length >0)
      {  
        const finalData  = data.map((obj)=>{
            obj.imageName=obj.imageName.map((img)=>{
             return "/productImage/"+img;
            })
            return obj;
        })
       return res.status(200).json({message:finalData});
      }
  }
  catch(err)
  {
    console.log(err);

  }

}

module.exports = 
{
  Product:mongoose.model('Product',productSchema),
  upload :multer({storage}),
  createProduct,
  getUniqueBrand,
  getProducts,
  getFlashSale,
  uploadPhoto,
  getSingleProduct,
  updateProduct,
  deleteProduct
}
