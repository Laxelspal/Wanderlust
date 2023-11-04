const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../Model/Listing.js");
const Review = require("../Model/Review.js");
const wrapAsync= require("../utils/WrapAsync.js");
const {listingSchema , reviewSchema} = require("../schema.js");

const {validateReview,isLoggedIn, isAuthor}= require("../middleware.js");
const reviewController= require("../controllers/review.js");

//Review Route
//Add Review Route
// isLoggedIn, validateReview, wrapAsync(reviewController.addReview)

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.addReview));

//Delete Review Route

router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewController.destroyReview));


module.exports=router;
