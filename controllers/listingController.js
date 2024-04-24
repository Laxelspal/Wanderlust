const Listing = require("../Model/listingModel.js");
const handleFactory =require("./handleFactory.js");

module.exports.aliasTopListings = (req,res,next)=>{
    req.query.limit ='5',
    req.query.sort= '-ratingsAverage , price';
    req.query.fields = 'title, price, ratingsAverage , summary'
    next();
}
module.exports.setUserId = (req,res,next)=>{
    //Alow nested routes
    if(!req.body.owner) req.body.owner =req.user.id;
    next();
}


module.exports.deleteListing = handleFactory.deleteOne(Listing);
module.exports.updateListing = handleFactory.updateOne(Listing);
module.exports.getListing = handleFactory.getOne(Listing,{path:"reviews"});
module.exports.createListing =handleFactory.createOne(Listing);
module.exports.getAllListings=handleFactory.getAll(Listing);




