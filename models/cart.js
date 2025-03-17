const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {Product} = require('./product');

const cartSchema=new mongoose.Schema({
    name:{type:String},
    buyerId: { type: mongoose.Types.ObjectId,required: true,ref:'User' }, 
    productId:{type:ObjectId,required:true,ref:'Product'},
    description:{type:String,required:true},
    quantity:{type:Number,required:true},
    price:{type:Number,required:true},
    brand:{type:String,required:true},
    status:{type:String,enum:["active","inactive"],default:"active",required:true},
    totalPrice:{type:Number,required:true},
    // finalQuanity:{type:Number},
    image:{type:String}
});
// here using the pre save hook to calculate the total prices 
cartSchema.pre("save", function (next) {
    this.totalPrice = this.price * this.quantity;
    next();
});

const Cart = mongoose.model('Cart',cartSchema);
const createCart =async(req,res)=>{
    try
    {   
        const { finalQuantity, ...cartData } = req.body;
        let updateRes;
        if(finalQuantity == 0 )
        {  updateRes = await Product.updateOne({_id:new ObjectId(cartData.productId)},{$set:{status:"inactive",quantity:finalQuantity}});}
        else 
        { updateRes = await Product.updateOne({_id:new ObjectId(cartData.productId)},{$set:{quantity:finalQuantity}}) ;  }
        console.log(updateRes);
        const newCart = new Cart(cartData);
        console.log(newCart);
         await newCart.save();
         return res.status(200).json({message:"successfully created cart"});
    }
    catch(err)
    {  console.log(err);
       return res.status(500).json({message:err.message});
    }
}

// send the one users card on the basic of the id
const  getCart=async(req,res)=>{
    const {buyerId}= req.params;
    
    console.log(req.params);
     try{
        console.log("getDat");
         const getData = await Cart.find({buyerId:buyerId});
         console.log(getData);
         
 return res.status(200).json({message:getData}); 
        //  else{
        //     return res.status(200).json({message:getData})
        //  }
         
         
     }
     catch(err)
     {
       console.log(err);
       res.status(500).json({error:err});
     }
     
}

const deleteAllCart=async(req,res)=>{
    try{
        const{buyerId} = req.params;
        const allCartInfo = await Cart.find({buyerId:buyerId});
        console.log(allCartInfo);
        // updating the corresponding value
        for (let i = 0; i < allCartInfo.length; i++) { 
            // Updating product
            let updateInfo = await Product.updateOne(
                { _id: new ObjectId(allCartInfo[i].productId)},
                { $inc: { quantity: allCartInfo[i].quantity } }
            );
            console.log(updateInfo);
        }
        
        //delte the cart
        const deleteInfo =await Cart.deleteMany({buyerId:buyerId});
        if(deleteInfo.deletedCount >0 )
        { return  res.status(200).json({message:"All the cart delete successfully"});  }
        res.status(404).json({error:"error while delete product"});
    }
    catch(err)
    {
        console.log(err);
       return  res.status(500).json({error:"error while deleting card"});
    }

}

const deleteCart=async (req,res)=>
{   try
    {
    
   console.log(req.params);
    const {cartId,productId,quantity} = req.params;

    
      if(!ObjectId.isValid(cartId))
    {return res.status(400).json({message:"invalid card id"});}
     const availableCard = await Cart.findOne({_id:new ObjectId(cartId)});
    if(!availableCard)
        {return res.status(400).json({message:"the cart are not available"});}
      updateRes = await Product.updateOne(
        {_id:new ObjectId(productId)},
        {$inc:{quantity:quantity},
        $set:{status:quantity>0?"active":'inactive'}}

     );
      const response =await Cart.deleteOne({ _id:new ObjectId(cartId)});
     if (response.deletedCount == 0)
        {return res.status(404).json({message: "Product not found or not authorized to delete" }); }
      return res.status(200).json({message: "Product deleted successfully"});
     }
   catch(err)
    {   console.log(err);
        return res.status(500).json({message:err});
    }   

}
const updateCart=async(req,res)=>
{
    try{
        console.log("enter");
        const {productId,cartId,cartFinalQty,productFinalQty}= req.body;
        console.log(productFinalQty);
        
        console.log(req.body)
        //here chcecking item availabe or not 
        const existingCart = await Cart.findById(cartId);
        if(!existingCart)
        { return res.status(400).json({message:"invalid car id format"});
        } 
        // update product 
         const updateRes = await Product.updateOne({_id:new ObjectId(productId)},{$set:{quantity:productFinalQty==null?0:productFinalQty}});
        const cartResult = await Cart.updateOne({_id:new ObjectId(cartId)},{$set:{quantity:cartFinalQty==null?0:cartFinalQty}});
        console.log(updateRes);
        console.log(cartResult);
        if(cartResult.matchedCount>0)
        {
        //update cart
        return  res.status(200).json({message:"cart are successfully updated"});
        }
    }
    catch(err)
    { console.log(err);
     return res.status(500).json({message:err.message});
    }
}


module.exports={
    Cart:mongoose.model('Cart',cartSchema),
    getCart,
    createCart,
    deleteCart,
    deleteAllCart,
    updateCart
}