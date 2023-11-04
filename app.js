
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app= express();
const port= 8080;
const mongoose= require('mongoose');
const path= require("path");
const methodOverride= require("method-override");
const ExpressError= require("./utils/ExpressError.js");
const listingsRouter =require("./routes/listing.js");
const reviewsRouter =require("./routes/review.js");
const userRouter =require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User= require("./Model/User.js");

let DBUrl = process.env.MongoDBUrl;

main()
    .then(()=>{
        console.log("Database is connected");
    })
    .catch((err)=>{
        console.log(err);
    })


async function main() {
    await mongoose.connect(DBUrl);
}


const ejsmate= require("ejs-mate");
const Review = require("./Model/Review.js");
const router = require("./routes/listing.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl:DBUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 3*24*60*60
});

store.on("error",()=>{
    console.log("Error in Mongo Session store",err)
})

const sessionoption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req,res)=>{

//     let fakeuser= new User({
//         email:"student@123",
//         username:"delat_student"
//     });

//     let registeredUser= await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);

// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.get("*",(req,res,next)=>{
    next( new ExpressError(404,"Page not Found"));
})

app.use((err,req,res,next)=>{
    let {status=405, message="Something went Wrong"} = err;
    res.status(status).render("error.ejs",{message});
})

app.listen(port,(req,res)=>{
    console.log(`app is listening on port  ${port}`)
})