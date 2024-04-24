const express = require("express");
const router = express.Router();
const listingController= require("../controllers/listingController");
const reviewRouter =require("./reviewRoute");
const authController =require("../controllers/authcontroller");

router.use("/:listingId/reviews",reviewRouter)

router
    .route("/")
    .get(listingController.getAllListings)
    .post( authController.protect,listingController.setUserId, listingController.createListing)

router
    .route("/:id")
    .get(listingController.getListing)
    .patch(authController.protect, listingController.updateListing)
    .delete(authController.protect,listingController.deleteListing);

router 
    .route("/top-5-cheap")
    .get(listingController.aliasTopListings, listingController.getAllListings)

module.exports=router;