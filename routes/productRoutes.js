const express = require('express');
const  productRouter = express.Router();
const {createProduct,getProduct, updateProduct,deleteProduct,upload,uploadPhoto} = require('../models/product');
productRouter.post('/createProduct',upload.array("files",12),uploadPhoto,createProduct);
productRouter.put('/getProduct/:productId/:checkAll',getProduct);
productRouter.put('/updateProduct/:productId',updateProduct);
productRouter.delete('/deleteProduct/:productId',deleteProduct);
module.exports = productRouter;

