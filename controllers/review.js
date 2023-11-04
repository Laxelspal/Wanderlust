const Listing= require("../Model/Listing.js");
const Review= require("../Model/Review.js");

module.exports.addReview= async(req,res)=>{

    let listing= await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await  listing.save();
    req.flash("success"," Review is added");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview =async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review is deleted");
    res.redirect(`/listings/${id}`);
};