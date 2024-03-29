const mongoose= require("mongoose");
const Review = require("./Review");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    Images:[String],
    price:{
        type:Number,
        defult:0
    },
    location:{
        type:String,
        text:true,

    },
    country:String,
    category: {
        type:String,
        enum: ["Trending","Rooms","Farms","Arctic","Beach","Castles","Amazing Pools","Mountain","Lake","Camping","Domes","Boats"],
    },

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in :listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;