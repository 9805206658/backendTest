const express = require('express');
const cartRouter = express.Router();
const {authntication} = require('../middlewares/authenticationToken');
const{createCart,deleteCart,updateCart,getCart,deleteAllCart} = require('../models/cart');
cartRouter.post("/createCart",authntication,createCart);
cartRouter.get("/getCart/:buyerId",getCart);
cartRouter.delete("/deleteCart/:cartId/:productId/:quantity",deleteCart);
cartRouter.delete("/deleteAllCart/:buyerId",deleteAllCart);
cartRouter.put("/updateCart",updateCart);
module.exports = cartRouter;
