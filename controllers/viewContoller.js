const catchAsync = require("../utils/CatchAsync");
const Listing = require("../Model/listingModel");
const User = require("../Model/UserModel.js");
const Booking =require("../Model/bookingModel.js");
const Review = require("../Model/ReviewModel.js");


const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.MAP_TOKEN;
// console.log("Map token",process.env.MAP_TOKEN);
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const cloudinary =require("../cloudConfig.js");
const CatchAsync = require("../utils/CatchAsync");

module.exports.getOverview = catchAsync(async (req,res,next)=>{
    let data =  await Listing.find();
    res.render("listings/index.ejs",{data});
});

module.exports.getSignup =(req,res,next)=>{
    res.render("user/signup.ejs");
}
module.exports.getLogin =(req,res,next)=>{
    res.render("user/login.ejs");
}

module.exports.updateMe =CatchAsync(async(req,res,next)=>{
    // console.log(req.body);
    const doc = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!doc){
        return next(new AppError('No document found with this ID',404));
    }
    req.flash("success","your Information Updated successfully");
    res.redirect(`/listings/user/${req.params.id}`);

});

module.exports.addNewListing =(req,res,next)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing =catchAsync(async(req,res,next)=>{
    let data = await Listing.findById(req.params.id).populate({path:"reviews"}).populate({path:"owner"});
    let bookings = await Booking.find({listing:req.params.id});
    res.render("listings/show.ejs",{data,bookings});
});

module.exports.getEditPage= CatchAsync(async(req,res,next)=>{
    let listing= await Listing.findById(req.params.id);
    res.render("listings/edit.ejs",{listing});
});
module.exports.getUser=catchAsync(async(req,res,next)=>{
    let user = await User.findById(req.params.id);
    res.render("user/Profile.ejs",{user});
});


module.exports.uploadUserPhotoCloudinary= CatchAsync(async(req,res,next)=>{
    // Add images
   if( typeof req.file != "undefined"){
      let path = await cloudinary.uploadsUser(req.file);
      req.body.photo=path.url;       
   }
   next();
});

module.exports.uploadListingImagesCloudinary= CatchAsync(async(req,res,next)=>{
     // Add images
    if( typeof req.files.images != "undefined"){
        req.body.listing.images =[];
        req.files.images.forEach(async(el)=> {
            let path = await cloudinary.uploadsListing(el);
            req.body.listing.images.push(path.url);
        });     
    }
    if( typeof req.files.coverImage != "undefined"){
       let path = await cloudinary.uploadsListing(req.files.coverImage[0]);
       req.body.listing.coverImage=path.url;
            
    }
    next();
});

module.exports.addGeoAndAmenities = catchAsync(async(req,res,next)=>{
    // Geocoding
    let response = await geocodingClient.forwardGeocode({query: req.body.listing.location,limit: 1}).send();
    let location = response.body.features[0].geometry;
    location.address=req.body.listing.location;
    req.body.listing.location=location;
    
    // amentities add
    if( req.body.amenities!=undefined &&  req.body.amenities!=null){
        let amenities =Object.keys(req.body.amenities);
        req.body.listing.amenities=amenities;
    
    }
    next();
})

module.exports.addListing = catchAsync(async(req,res,next)=>{
    let newListing =req.body.listing;
    
    let listing = await Listing.create({...newListing,owner:req.user.id});
    req.flash("success"," you successfully hosted your house.");
    res.redirect("/listings");

});

module.exports.updateListing = CatchAsync(async(req,res,next)=>{
    let listing=await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing},{new:true,runValidators:true});
    req.flash("success"," you successfully updated your listing");
    res.redirect("/listings")
});


module.exports.getResetPasswordForm=(req,res,next)=>{
    let token =req.params.token;
    res.render("user/updatePassword.ejs",{token});
}

module.exports.getDisatnceListings= catchAsync(async(req,res,next)=>{
    let place=req.query.place;

    //Geocodeing
    let response = await geocodingClient.forwardGeocode({query: place,limit: 1}).send();
    let location = response.body.features[0].geometry.coordinates;
    let distance =50;
    let unit='km';

    const radious = unit=="mi" ? distance/3963.2 : distance/6378.1;
    const listings = await Listing.find({

        location : {
            $geoWithin :{
              $centerSphere: [location,radious]
            }
        }
    });
    res.render("listings/search.ejs",{listings,place,location});
});

module.exports.addWishlist=catchAsync(async(req,res,next)=>{
    // console.log(req.params.id);
    let {id}=req.params;
    let user = req.user;
    user.wishlist.push(id);
    await User.findByIdAndUpdate(req.user._id,user);
    req.flash("success","Listing is added to your favrite list!");
    res.redirect("/listings");
});

module.exports.removeWishlist = catchAsync(async(req,res,next)=>{
    let {id}=req.params;
    let user = req.user;
    user.wishlist.remove(id);
    await User.findByIdAndUpdate(req.user._id,user);
    req.flash("success","Listing is removed from your favrite list!");
    res.redirect("/listings");

});
module.exports.getAllFavorites= catchAsync(async(req,res,next)=>{
    let user = await User.findById(req.user.id).populate("wishlist");
    let listings = user.wishlist;
    res.locals.currUser = req.user
    res.render("listings/wishlist.ejs",{listings,username:user.name});

});

module.exports.filterCategory =CatchAsync(async(req,res,next)=>{
    let {category}=req.params;
    let data = await Listing.find({category:category});
    res.render("listings/index.ejs",{data});
});

module.exports.getUserBooking =catchAsync(async (req,res,next)=>{
    const bookings = await Booking.find({user:req.user._id});
    res.render("listings/booking.ejs",{bookings});
});

module.exports.createReview = CatchAsync(async(req,res,next)=>{
    // console.log(req.body);
    await Review.create(req.body);
    let {listingId} =req.params;
    req.flash("success","Your review successfully added");
    res.redirect(`/listings/${listingId}`);
});
module.exports.deleteReview = CatchAsync(async(req,res,next)=>{
    const doc =await Review.findByIdAndDelete(req.params.id);
    let {listingId} =req.params;
    if(!doc){
        return next(new AppError('No review found with this ID',404));
    }
    
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${listingId}`);
});

module.exports.getAllReviews=catchAsync(async(req,res,next)=>{
    const Reviews = await Review.find({user:req.user._id});
    console.log("There are my all reviews",Reviews);
    res.render("listings/myallReviews.ejs",{Reviews})
});
module.exports.deleteListing =catchAsync(async(req,res,next)=>{
    let {id}= req.params;
    await Review.deleteMany({listing:id});
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing successfully deleted !");
    res.redirect("/listings"); 
})