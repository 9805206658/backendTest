const express = require("express");
const ratingRouter = express.Router();
const{createRating} = require('../models/rating');
ratingRouter.post('/createRating',createRating);
module.exports = ratingRouter;