const express = require("express");
const app= express();
const bodyparser = require("body-parser");
const userRouter = require("./routes/userRoute");
const listingRouter = require("./routes/listingRoute");
const viewRouter =require("./routes/viewRoute");
const bookingRouter =require("./routes/bokingRoute");
const AppError= require("./utils/AppError");
const globalErrorHandler =require("./controllers/ErrorController");
const cookieParser =require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSenitise = require("express-mongo-sanitize");
const MongoStore = require('connect-mongo');
const path = require("path");
const ejsmate = require("ejs-mate");
const session = require("express-session");
const methodOveride =require("method-override");


const flash = require("connect-flash");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsmate);
app.use(methodOveride("_method"));

let DBUrl = process.env.MongoDBUrl;
const url = "mongodb://127.0.0.1:27017/Wanderlust";

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

app.use(flash());
app.use(session(sessionoption));



// app.use(limiter);
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(mongoSenitise())



app.use("/listings",viewRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/listings",listingRouter);
app.use("/api/v1/bookings",bookingRouter);


app.all("*",(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
});


app.use(globalErrorHandler);
module.exports=app;