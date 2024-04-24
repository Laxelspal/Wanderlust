const mongoose= require("mongoose");
const validator = require("validator");
const bycript = require("bcryptjs");
const Schema = mongoose.Schema;
const crypto= require("crypto");
const passport = require("passport");

const userSchema= new Schema({
    name:{
        type:String,
        required:[true,"Please tell us your name !"]
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:{
        type:String,
        default:"https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
    },
    role:{
        type:String,
        enum:['user','admin','techLead'],
        default:'user'
    },
    wishlist:[
        {
            type:Schema.Types.ObjectId,
            ref:"Listing",
        }
    ],
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,
        select: false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            validator:function(el){
                return el ===this.password;
            },
            message:"Password are not the same!"
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpire:Date,
    active:{
        type:Boolean,
        default:true,
        select:false,
    }
});

userSchema.pre(/^find/,function(next){
   //this points to the current query
   this.find({active:{$ne:false}});
   next(); 
})

userSchema.pre("save", async function(next){
    // console.log("Document",this);
    //only run this function if password was acually modified
    if(!this.isModified('password')) return next();

    //Hash the password with the cost of 12
    this.password = await bycript.hash(this.password,12);
    
    //Delete passwordConfirm field
    this.passwordConfirm=undefined;
    next();

});

userSchema.pre("save",function(next){
    if(! this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt=Date.now()-1000;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return  await bycript.compare(candidatePassword,userPassword);;
}

userSchema.methods.changedPasswordAfter = function(jwtTimestamp){
    if(this.passwordChangedAt){
        
        const changeTimeStamp =parseInt(this.passwordChangedAt.getTime()/1000,10);
        // console.log(changeTimeStamp,jwtTimestamp);

        return jwtTimestamp<changeTimeStamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken=function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpire=Date.now()+10*60*1000;
    console.log("reset Token :",this.passwordResetToken,this.passwordResetExpire);
    return resetToken;
}

module.exports= mongoose.model("User",userSchema);

