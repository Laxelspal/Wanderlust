const express = require("express");
const router = express.Router();
const Listing = require("../Model/Listing.js");
const User  = require("../Model/User.js");
const wrapAsync= require("../utils/WrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
// const multer  = require('multer');
// const {storage} = require('../cloudConfig.js')
const upload = require('../multer.js');
const claudinary =require("../cloudConfig.js");

const fs = require("fs");
if (!fs.existsSync("./uploads")) { 
    fs.mkdirSync("./uploads"); 
} 

// const upload = multer({storage:storage});

const {listingSchema , reviewSchema} = require("../schema.js");
const listingController = require("../controllers/listing.js");
const { addWishlist, RemoveWishlist } = require("../controllers/user.js");


router
    .route("/")
    .get(wrapAsync(listingController.Index ))
    // .post(
    //     upload.single('listing[image]'),validateListing,wrapAsync(listingController.addListing)
    // );
    .post( upload.array('listing[Images]',12),
        validateListing,
        wrapAsync(listingController.addListing)
    )
    
//New Route
router.get("/new",isLoggedIn,listingController.renderNewListing)

//Search Route
router.get("/search",listingController.Search);

//Add WishList Route
router.get("/wishlist/:id",isLoggedIn,wrapAsync(addWishlist));
router.get("/ReWishlist/:id",isLoggedIn, wrapAsync(RemoveWishlist));   

//Filter Route
router.get("/filter/:id",listingController.Filter);

router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner, upload.array('listing[Images]',12), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



//Edit Route
router.get("/:id/edit",
   isLoggedIn,
   isOwner, 
   wrapAsync(listingController.editListing));
 

module.exports=router;