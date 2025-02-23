// // import the moongose libary 
// const mongoose = require('mongoose');
// // new mongoose.Schema();
// const {Schema} = mongoose;
// const userSchema = new Schema({
//   _id:String,
//   studentName:String,
//   email:String,
//   password:String
// });

// const mongoose = require('mongoose');
// module.exports = mongoose.model('student',userSchema);

// here making get request
const express = require('express');
const app = new express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require('mongoose');
const {Schema} = mongoose;
const motuPatlu = new Schema({
  memberName : String,
  joke :String,
  contactInfo :Number
});
// here constructing the object using the Member class;
motuPatlu.methods.speak=function speak()
{
  console.log("i am"+this.memberName);
}
// module.exports = mongoose.model("Member",motuPatlu);
const Member = mongoose.model('Member',motuPatlu);

exports.createMember = async (req, res) => {
  const memberData = req.body;
  console.log(memberData);
  const member = new Member(memberData);

  try {
    // Save the data in MongoDB
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllMember = async(req,res)=>{
  // getting the data from database atlasa;
  console.log("enter in the getting process");
  try{
    const members = await Member.find();
    res.status(200).send(members);
  }
  catch(err)
  {
    console.log(err);
  }

}


// const motu = new Member({memberName:"Motu",joke:"hahaaha",contactInfo:9805206658});



