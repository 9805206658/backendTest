const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const cartSchema=new mongoose.Schema({
    seller_id: { type: mongoose.Types.ObjectId,required: true,ref:'User' }, 
    product_id:{type:ObjectId,required:true,ref:'Product'},
    description:{type:String},
    quantity:{type:Number,required:true},
    price:{type:Number,required:true},
    brand:{type:String,required:true},
    status:{type:String,enum:["active","inactive"],default:"active",required:true},
    total_price:{type:Number}
});

// here using the pre save hook to calculate the total prices 
cartSchema.pre("save",(next)=>{
    console.log("engte");
  this.total_price = this.price*this.quantity;
    next();
})
const Cart = mongoose.model('Cart',cartSchema);
const createCart =async(req,res)=>{
    try
    {
        console.log("enter");
        console.log(req.body);
        const cartInfo = req.body;
        const newCart = new Cart(cartInfo);
        await newCart.save();
       return res.status(200).json({message:"successfully created cart"});
    }
    catch(err)
    {
       return res.status(500).json({message:err.message});
    }
}
// const 
const deleteCart=async (req,res)=>
{   try
    {
    const {cartId} = req.params;
    console.log(cartId);
    // check the cardId valid or not
    if(!ObjectId.isValid(cartId))
    {return res.status(400).json({message:"invalid card id"});}

    // before deleting check the item available or not 
    const availableCard = await Cart.findOne({_id:new ObjectId(cartId)});
    if(!availableCard)
    {
      return res.status(400).json({message:"the product are not available"});
    }
     const response =await Cart.deleteOne({ _id:new ObjectId(cartId)});
     console.log(response);
     if (response.deletedCount == 0)
        {return res.status(404).json({message: "Product not found or not authorized to delete" }); }
         return res.status(404).json({message: "Product deleted successfully"});
     }
    
    catch(err)
    {
        console.log(err);
        return res.status(500),json({message:err.message});
    }   

}
const updateCart=async(req,res)=>
{
    try{
        console.log("enter");
        const {cartId} = req.params;
        const cartInfo = req.body;
        //here chcecking item availabe or not
        
        const existingCart = await Cart.findById(cartId);
        if(!existingCart)
        {
         return res.status(400).json({message:"invalid car id format"});
        } 
        // here updating the cart
        const updateCart = await Cart.findByIdAndUpdate(cartId,cartInfo,{new:true,runValidators:true});
        if(!updateCart)
        {
         return res.status(400).json({message:"faile to udpate cart"});
        }
        const updateProps= new Set();;
        
         for (let key in cartInfo ) {
            console.log(cartInfo[key]);
            console.log(existingCart[key]);
            if(cartInfo[key] != existingCart[key])
            {
            updateProps.add(key);
            }
          }
       const udpateTextField = [...updateProps].join(",")||"no fields";
       return res.status(200).json
        ( { 
          message:`succefully update ${udpateTextField}`,
          updateCart
         });
    }
    catch(err)
    { console.log(err);
     return res.status(500).json({message:err.message});
    }
}


module.exports={
    Cart:mongoose.model('Cart',cartSchema),
    createCart,
    deleteCart,
    updateCart
}