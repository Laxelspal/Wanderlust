const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewContoller");
const authcontroller =require("../controllers/authcontroller");
const multer =require("../multer");
const handleFactory =require("../controllers/handleFactory");
const Listing = require("../Model/listingModel");
const reviewController =require("../controllers/reviewContoller");
const Review =require("../Model/ReviewModel"); 
const User = require("../Model/UserModel.js");
const bookingController = require("../controllers/bookingController.js");

router.use(authcontroller.isLoggedIn);

router.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || undefined;
    console.log(req.user);
    next();
});


router.
    route("/")
    .get( bookingController.createBookingCheckout,viewController.getOverview)
    .post( multer.uploadListingImages, viewController.uploadListingImagesCloudinary,viewController.addGeoAndAmenities, viewController.addListing);

router.get("/signup",viewController.getSignup);
router.post("/signup",multer.uploadUserPhoto,viewController.uploadUserPhotoCloudinary, authcontroller.signup);
router.get("/login",viewController.getLogin);
router.post("/login",authcontroller.login);
router.get("/logout",authcontroller.logout);

router.post("/forgotPassword",authcontroller.forgetPassword);
router.get("/resetPassword/:token",viewController.getResetPasswordForm);
router.post("/resetPassword/:token",authcontroller.resetPassword);

router.get("/new",authcontroller.protect,viewController.addNewListing);
router.get("/:id/edit",viewController.getEditPage);

router.post("/:listingId/reviews",reviewController.setListingUserIds, viewController.createReview);
router.delete("/:listingId/reviews/:id",authcontroller.protect, viewController.deleteReview);


router.post("/user/updateMe/:id",multer.uploadUserPhoto,viewController.uploadUserPhotoCloudinary,viewController.updateMe);
router.post("/user/changePassword/:id",authcontroller.updatePassword);

router.get("/user/wishlist",authcontroller.protect,viewController.getAllFavorites);
router.get("/user/booking",authcontroller.protect,viewController.getUserBooking);
router.get("/user/reviews", authcontroller.protect,viewController.getAllReviews);
router.get("/user/:id",viewController.getUser);

router.get("/search",viewController.getDisatnceListings);

router.get("/wishlist/:id",authcontroller.protect,viewController.addWishlist);
router.get("/ReWishlist/:id",authcontroller.protect,viewController.removeWishlist);
router.get("/filter/:category",viewController.filterCategory);


router.get("/:id",viewController.showListing);
router.put("/:id",multer.uploadListingImages, viewController.uploadListingImagesCloudinary,viewController.addGeoAndAmenities, viewController.updateListing);
router.delete("/:id",viewController.deleteListing);

module.exports =router;