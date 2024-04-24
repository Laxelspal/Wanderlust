const express = require("express");
const router = express.Router({mergeParams:true});
const reviewController= require("../controllers/reviewContoller.js");
const authcontoller =require("../controllers/authcontroller.js");



router
    .route("/")
    .get(reviewController.getAllReviews)
    .post(authcontoller.protect,reviewController.setListingUserIds, reviewController.createReview)

router
    .route("/:id")
    .get(reviewController.getReview)
    .patch(authcontoller.protect ,reviewController.updateReview)
    .delete(authcontoller.protect,reviewController.deleteReview)
    
    
module.exports=router;

