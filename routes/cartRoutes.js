const express = require('express');
const carRouter = express.Router();
const{createCart,deleteCart,updateCart} = require('../models/cart');
carRouter.post("/createCart",createCart);
carRouter.delete("/deleteCart/:cartId",deleteCart);
carRouter.put("/updateCart/:cartId",updateCart);
module.exports = carRouter;
