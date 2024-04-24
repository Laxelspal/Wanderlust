const Review = require("../Model/ReviewModel");
const handleFactory =require("./handleFactory");


module.exports.setListingUserIds = (req,res,next)=>{
    //Alow nested routes
    if(!req.body.user) req.body.user =req.user.id;
    if(!req.body.listing) req.body.listing =req.params.listingId;
    next();
}

module.exports.getAllReviews =handleFactory.getAll(Review);
module.exports.createReview = handleFactory.createOne(Review);
module.exports.updateReview =handleFactory.updateOne(Review);
module.exports.deleteReview = handleFactory.deleteOne(Review);
module.exports.getReview =handleFactory.getOne(Review);


