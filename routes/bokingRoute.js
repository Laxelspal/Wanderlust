const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authcontroller =require("../controllers/authcontroller");

router.get("/checkout-session/:listingId",authcontroller.protect,bookingController.getCheckoutSession);
router.get("/:id" ,bookingController.removeBooking);

module.exports=router;