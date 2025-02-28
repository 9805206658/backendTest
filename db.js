
require('dotenv').config();
const uri = process.env.MONGO_URI;
const mongoose = require('mongoose');
const connectDB = async()=>
{try{
    await mongoose.connect(uri);
    console.log("your database are connect successfully");
  }
  catch(err)
  { console.log("error are arise"+err);
    process.exit(1);
  }

}
module.exports = connectDB;

