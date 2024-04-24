const User =require("../Model/UserModel.js");
const Listing = require("../Model/listingModel.js");
const CatchAsync= require("../utils/CatchAsync.js");
const handleFactory =require("./handleFactory.js");

module.exports.getUser= handleFactory.getOne(User);
module.exports.deleteUser= handleFactory.deleteOne(User);
module.exports.getAllUser =handleFactory.getAll(User);

module.exports.deleteMe = CatchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(200).json({
        status:"success",
        data:null
    })
});



const filterObj = (obj,...allowedFields)=>{
    const newObj = {};

    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
            newObj[el]=obj[el];
        }
    })
    return newObj;
};

module.exports.updateMe = CatchAsync(async(req,res,next)=>{
    //1) Create  error if user Posts paswor
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("This route is not for password updates. Please use /updatePassword/",400));
    }

    //2)Update user Document
    const filterBody = filterObj(req.body,'name','email','role');
    if(req.file) filterBody.photo =req.file.filename;
    const updateUser = await User.findByIdAndUpdate(req.user._id,filterBody,{runValidators:true,new:true});

    res.status(200).json({
        status:"success",
        data:{
            user:updateUser
        }
    })
});


module.exports.addWishlist = async(req,res)=>{
    let {id} = req.params;
    let newListing =  await Listing.findOne({"_id":id});
    let curruser = await User.findById(res.locals.currUser._id);
    await curruser.wishlist.push(newListing);
    await curruser.save();
    // console.log(curruser);
    req.flash("success","New listing is added to your wishlist");
    res.redirect("/listings");
}
module.exports.RemoveWishlist = async(req,res)=>{
    let {id} = req.params;
    let newListing =  await Listing.findOne({"_id":id});
    let curruser = await User.findById(res.locals.currUser._id);
    await curruser.wishlist.remove(newListing);
    await curruser.save();
    // console.log(curruser);
    req.flash("success","listing is removed from your wishlist");
    let redirect = res.locals.redirect || "/listings";
    res.redirect(redirect);
}


module.exports.showWishlist = async(req,res)=>{
    let {id} = req.params;
    let userInfo =  await User.findOne({"_id":id}).populate('wishlist');
    let savedListing = userInfo.wishlist;
    // console.log(userInfo.username,savedListing);
    res.render("listings/wishlist.ejs",{username:userInfo.username,listings:savedListing});
}