const express = require("express");
const router = express.Router();
const Listing = require("../Model/Listing.js");
const wrapAsync= require("../utils/WrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage });

const {listingSchema , reviewSchema} = require("../schema.js");
const listingController = require("../controllers/listing.js");


router
    .route("/")
    .get(wrapAsync(listingController.Index ))
    .post(upload.single('listing[image]'),validateListing,wrapAsync(listingController.addListing));
    
//New Route
router.get("/new",isLoggedIn,listingController.renderNewListing)

//Search Route
router.get("/search",listingController.Search);

//Filter Route
router.get("/filter/:id",listingController.Filter);

router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



//Edit Route
router.get("/:id/edit",
   isLoggedIn,
   isOwner, 
   wrapAsync(listingController.editListing));
 

module.exports=router;