const User =require("../Model/User.js");
const Listing = require("../Model/Listing.js");
module.exports.signUpForm =(req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.postSignUp =async(req,res)=>{
    try{
        let {username,email,password}= req.body;
        let newUser= new User({email,username});
        let registerUser = await User.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm =(req,res)=>{
    res.render("user/login.ejs")
};

module.exports.login =async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirect = res.locals.redirect || "/listings";
    res.redirect(redirect);
};

module.exports.logout= (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you successfully logged out !");
        res.redirect("/listings");
    })
};

module.exports.addWishlist = async(req,res)=>{
    let {id} = req.params;
    let newListing =  await Listing.findOne({"_id":id});
    let curruser = await User.findById(res.locals.currUser._id);
    await curruser.wishlist.push(newListing);
    await curruser.save();
    console.log(curruser);
    req.flash("success","New listing is added to your wishlist");
    res.redirect("/listings");
}
module.exports.RemoveWishlist = async(req,res)=>{
    let {id} = req.params;
    let newListing =  await Listing.findOne({"_id":id});
    let curruser = await User.findById(res.locals.currUser._id);
    await curruser.wishlist.remove(newListing);
    await curruser.save();
    console.log(curruser);
    req.flash("success","listing is removed from your wishlist");
    let redirect = res.locals.redirect || "/listings";
    res.redirect(redirect);
}


module.exports.showWishlist = async(req,res)=>{
    let {id} = req.params;
    let userInfo =  await User.findOne({"_id":id}).populate('wishlist');
    let savedListing = userInfo.wishlist;
    console.log(userInfo.username,savedListing);
    res.render("listings/wishlist.ejs",{username:userInfo.username,listings:savedListing});
}