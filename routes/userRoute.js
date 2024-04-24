const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js")
const authcontroller = require("../controllers/authcontroller.js");


router.use(authcontroller.isLoggedIn);

router.post("/signup",authcontroller.signup);
router.post("/login", authcontroller.login);
router.post("/forgetPassword",authcontroller.forgetPassword);
router.post("/resetPassword/:token",authcontroller.resetPassword);

router.use(authcontroller.protect);

router.patch("/updatePassword",authcontroller.protect,authcontroller.updatePassword); 
router.patch("/updateMe", authcontroller.protect,userController.updateMe);  
router.delete("/deleteMe",authcontroller.protect,userController.deleteMe);


router.route("/")
    .get(authcontroller.restrictTo('admin'),userController.getAllUser);

router
    .route("/:id")
    .get(userController.getUser)
    .delete(authcontroller.restrictTo('admin'),userController.deleteUser);
  

module.exports= router;