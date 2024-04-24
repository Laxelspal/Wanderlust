const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"Booking must belong to a user!"]
    },
    listing:{
        type:mongoose.Schema.ObjectId,
        ref:"Listing",
        required:[true,"Booking must belong to a Listing!"]
    },
    price:{
        type:Number,
        required:[true,"Booking must have  a price"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },

});

bookingSchema.pre(/^find/,function(next){
    this.populate({
        path:"user",
        select:"name photo"
    }).populate({
        path:"listing",
        select:"coverImage title"
    });
    next();
});

const Booking = mongoose.model("Booking",bookingSchema);

module.exports=Booking;