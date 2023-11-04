const User =require("../Model/User.js");

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