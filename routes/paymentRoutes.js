const express = require('express');
const paymentRouter = express.Router();
const {pay,success,failure} =require('../models/payment')
paymentRouter.post('/pay',pay);
paymentRouter.get('/success',success);
paymentRouter.get('/failure',failure);
module.exports = paymentRouter;