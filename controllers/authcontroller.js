const User = require("../Model/UserModel");
const AppError = require("../utils/AppError.js");
const CatchAsync = require("../utils/CatchAsync.js");
const jwt = require("jsonwebtoken");
const {promisify} = require('util');
const sendEmail= require("../utils/Email.js")
const crypto= require("crypto");

module.exports.signup = CatchAsync(async (req, res, next) => {
    console.log(req.body);
    const newuser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        photo:req.body.photo
    });
    createSendToken(newuser,201,req,res);
});


module.exports.protect =CatchAsync(async(req,res,next)=>{
    //1 Find the token and check if it is there
    let token;
    //    console.log(req.headers);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    } 
    else if(req.cookies.jwt1){
        token = req.cookies.jwt1;
    }   
     
    if(!token){
       return next(new AppError("your are not logged in. Please log in to get access",401));
    }
 
    //2) Verify Token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);   
 
    //3) check if User still exist
    let freshUser;
    freshUser= await User.findById(decoded.id);
    if(!freshUser){
        let currerror=new AppError("The user belonging to this token does not exists!",401);
        return next(currerror);
    }
 
    //4) check if user chaned the password after the token was issued.
    if(freshUser.changedPasswordAfter(decoded.iat)){
       return next(new AppError("User recently changed password. Please login again!",401))
    }
    res.locals.user =freshUser;
    req.user=freshUser;
    next();
 });


const signToken = id=>{
    // console.log("Secret key ",process.env.JWT_SECRET)
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

module.exports.login= CatchAsync(async(req,res,next)=>{
    console.log("in auth controller");
    const {email,password} =req.body;
    //1) check if email and password exist
    if(!email || !password){
        return next(new AppError("Please provide email and password !",400));
    }

    //2) check if user exists && password is correct
    const user = await User.findOne({email}).select("+password");
    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password',401));
    }

    //3) Everything is okay, send token to client
    // req.user=user;
    createSendToken(user,200,req,res);

});

module.exports.isLoggedIn = async(req,res,next)=>{
    //1 Find the token and check if it is there
    let token;
    if(req.cookies.jwt1){

        try {
            token = req.cookies.jwt1;
            
            //2) Verify Token
            const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET); 
            //3) check if User still exist
            let freshUser;
            freshUser= await User.findById(decoded.id);
            if(!freshUser){
                return next();
            }

            //4) check if user chaned the password after the token was issued.
            if(freshUser.changedPasswordAfter(decoded.iat)){
               return next();
            }
            res.locals.user =freshUser;
            req.user = freshUser;
            return next(); 

        }
        catch(err){
            console.log(err);
            return next();
        }
       
    }

    return next();
 };

module.exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You Dont have permission to perform this action',403));
        }
        next();
    }
};


exports.forgetPassword = CatchAsync(async(req,res,next)=>{

    //1) Get User based on the posted email
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next (new AppError('There is no user with this email address',403));
    }

    //2) Generate the random token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});

    //3) Send it to the user email
    let resetUrl;
    if(req.originalUrl.startsWith("/api")){
        resetUrl =`${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
    }
    else{
        resetUrl =`${req.protocol}://${req.get('host')}/listings/resetPassword/${resetToken}`;
    }
    const message = `Forget your password ? submit a patch request with the your new password and passwordConfirm to : ${resetUrl}./n If you didn't forget your password please ignore this email !! `;

    try{
        await sendEmail({
            email:user.email,
            subject:'Your password Reset Token',
            message
        });
        
        if(req.originalUrl.startsWith('/api')){
            return  res.status(200).json({
                status:"success",
                message:'Token sent to email'
            });
        }
        req.flash("success","Token sent to  your Email");
        res.redirect("/listings");
       
    }
    catch(err){

        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        
        await user.save({validateBeforeSave:false});

        return next(new AppError("there was a error in sending the email. Please try again later!",500));
    }
});

module.exports.resetPassword= CatchAsync(async(req,res,next)=>{
    ///1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken:hashedToken, passwordResetExpire:{$gt:Date.now()}});

    if(!user){
        return next(new AppError("Token is invalid or has expired",400));
    }

    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;

    await user.save();

    //3) update changedPasswordAt property for the user
    //4) Login the user and swnd the Jwt Token
    createSendToken(user,200,req,res);

});

const createSendToken =(user,statusCode,req,res)=>{
    const token = signToken(user._id);
    const cookieOptions={
        expires:new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    };

    if(process.env.NODE_ENV==='production'){
        cookieOptions.secure=true;
    } 
    
    res.cookie("jwt1",token,cookieOptions);
    //Remove password from output
    user.password =undefined;
    if (req.originalUrl.startsWith('/api')) { 
        return res.status(statusCode).json({
            status:"success",
            token,
            data:{
                user
            }
        })
    }

    req.flash("success"," you successfully log in your account");
    res.redirect("/listings");    
};

module.exports.updatePassword = CatchAsync(async(req,res,next)=>{
    //1) Get user from the collection

    const user = await User.findById(req.user._id).select("+password");

    //2) Check if posted current password is currect
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError("Your current password is wrong !",401));
    }

    //3) If so, update password

    user.password=req.body.password;
    user.passwordConfirm= req.body.passwordConfirm;

    await user.save();
    createSendToken(user,200,req,res);
});
module.exports.logout = (req, res) => {
    res.cookie('jwt1', 'loggedout', {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true
    });
    if (req.originalUrl.startsWith('/api')) {
        return res.status(200).json({ status: 'success' }); 
    }

    req.flash("success"," you logged out successfully");
    res.redirect("/listings"); 
  };

module.exports.isOwner= Model=>async(req,res,next)=>{
    let doc = await Model.findById(req.params.id);
    if(!doc.user.equals(req.user.id)){
        return next(new AppError("Your are not the owner od this document",500));
    }
    next();
}










