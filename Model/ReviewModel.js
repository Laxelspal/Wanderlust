const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const Listing =require("../Model/listingModel");
// const User =require("./UserModel");

const reviewSchema= new Schema({
    comment:{
        type:String,
        required:[true,"Review can not be empty !"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"rating can not be empty!"]
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"Review must belong to a user"]
    },
    listing:{
        type:mongoose.Schema.ObjectId,
        ref:"Listing",
        required:[true,"Review must belong to  a Listing"]
    },
    
} ,{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
   }
);

reviewSchema.index({listing:1,user:1},{unique:true});

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'listing',
        select:'title'
    }).
    populate({
        path:'user',
        select:'name photo'
    });

    next();
});

reviewSchema.statics.calcAverageRatings = async function(listingId){
    const stats = await this.aggregate([
        {
            $match:{ listing:listingId}
        },
        {
            $group:{
                _id:'$listing',
                nRating:{$sum:1},
                avgRating:{$avg:"$rating"}
            }
        }
    ]);

    if(stats.length>0){
        await Listing.findByIdAndUpdate(listingId,{
            ratingsQuantity:stats[0].nRating,
            ratingsAverage:stats[0].avgRating
        });
    }
    else{
        await Listing.findByIdAndUpdate(listingId,{
            ratingsQuantity:0,
            ratingsAverage:4.5
        });
    }  
}

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r =  this.findOne();
    // console.log(this.r);
    next();
});

reviewSchema.post(/^findOneAnd/, async function(){
    // await this.findOne() does not work hear beacuse query is already executed.
    this.r.constructor.calcAverageRatings(this.r.listing);
});

reviewSchema.post('save',function(){
    this.constructor.calcAverageRatings(this.listing);
})

const Review = mongoose.model("Review",reviewSchema);
module.exports = Review;