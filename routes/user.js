const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const router = express.Router();
const User = require("../Model/User.js");
const passport= require("passport");
const { saveUrl } = require("../middleware");
const userController = require("../controllers/user.js")


router
    .route("/signup")
    .get(userController.signUpForm)
    .post(WrapAsync(userController.postSignUp));

router
    .route("/login")
    .get(userController.loginForm)
    .post(saveUrl,passport.authenticate('local', {  failureRedirect: '/login' ,failureFlash:true}),userController.login);



router.get("/logout",userController.logout)

module.exports= router;