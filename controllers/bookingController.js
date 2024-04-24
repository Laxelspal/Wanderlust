const stripe = require("stripe")(process.env.STRIPE_SECERET_KEY);
const Listing = require("../Model/listingModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");
const Booking = require("../Model/bookingModel");

module.exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked Listing
  try {
    const listing = await Listing.findById(req.params.listingId);
    //create customer
    const customer = await stripe.customers.create({
      name: req.user.name,
      email: req.user.email,
      address: {
        line1: "123 Main Street",
        city: "kanpur",
        postal_code: "1001",
        state: "UP",
        country: "IN",
      },
    });

    //2)) GEt checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/listings?listing=${
        req.params.listingId
      }&user=${req.user.id}&price=${listing.price}`,
      cancel_url: `${req.protocol}://${req.get("host")}/listing/${listing._id}`,
      client_reference_id: req.params.listingId,
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: `${listing.name} Listing`,
              // You can add more details about your product here
            },
            unit_amount: listing.price * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      err: err,
    });
  }
});

module.exports.createBookingCheckout = catchAsync(async (req,res,next)=>{
    const {listing,user,price }= req.query;
    if(!listing && !user && !price){
        return next();
    }
    await Booking.create({listing,user,price});
    req.flash("success","You have successfully booked the Listing !");
    next();
});

module.exports.removeBooking =catchAsync(async(req,res,next)=>{
    await Booking.findByIdAndDelete(req.params.id);
    req.flash("success","You have successfully deleted the  booked Listing !");
    res.redirect("/listings/user/booking");
});


