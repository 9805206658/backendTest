
const mongoose  = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const productSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Types.ObjectId,required: true,ref:'User' },
  brand: { type: String, required: true },
  frameMaterial: { type: String, required: true },
  weight: { type: Number, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required:true},  // ✅ Fixed here
  warrenty_period: { type: Number, required: false },
  image_name: { type: [String], required: true },
  status: { type: String, enum: ["active", "inactive"], required: true }
});

// here making product model
const Product= mongoose.model("Product",productSchema);
const createProduct = async(req,res)=>{
  try{
    const productInfo = req.body;
    const newProduct = new Product(productInfo);
    const savedProduct = await newProduct.save();
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
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct
}


