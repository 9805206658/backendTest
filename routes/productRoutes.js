const express = require('express');
const  productRouter = express.Router();
const {createProduct,getSingleProduct, updateProduct,deleteProduct,upload,uploadPhoto,getProducts, getFlashSale, getUniqueBrand, getSellerProduct,flashSaleUpdate,deleteAllProduct} = require('../models/product');
productRouter.post('/createProduct',upload.array("files",12),uploadPhoto,createProduct);
// productRouter.get("/readData",readData);
productRouter.get('/getSingleProduct/:productId',getSingleProduct);
productRouter.get('/getProducts',getProducts);
productRouter.get('/getUniqueBrand',getUniqueBrand);
productRouter.get('/getFlashSale',getFlashSale);
productRouter.put('/updateProduct/:productId',updateProduct);
productRouter.delete('/deleteProduct/:productId',deleteProduct);
// productRouter.delete('/deleteAllProduct/slelerId',deleteAllProduct);
productRouter.get('/getSellerProduct/:sellerId',getSellerProduct);
productRouter.put('/flashSaleUpdate/:productId/:isFlash',flashSaleUpdate);
productRouter.delete('/deleteAllProduct/:sellerId');


module.exports = productRouter;