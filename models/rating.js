const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const ratingSchema = new mongoose.Schema({
    product_id:{type:ObjectId,ref:'Product'},
    seller_id:{type:ObjectId,ref:'User'},
    review:{type:String,required:true},
    rating:{type:Number,required:true},
    createAt:{type:Date,default:Date.now()},
});
const Rating = mongoose.model('Rating',ratingSchema);
const createRating =async(req,res)=>{
    try
    {   console.log("enter");
        console.log(req.body);
        const ratingInfo = req.body;
        const newRating = new Rating(cartInfo);
        await newRating.save();
       return res.status(200).json({message:"successfully created rating"});
    }
    catch(err)
    {
       return res.status(500).json({message:err.message});
    }
}

module.exports={
    Rating:mongoose.model('Rating',ratingSchema),
    createRating,

}