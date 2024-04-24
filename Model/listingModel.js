const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:[true,"A listing have a title"],
        trim:true,
        maxlength:[60,"A listing title must be less that 60 characters"],
        minlength:[10,"A Listing title must have more or equal 10 characters"]
    },
    maxGuests:{
        type:Number,
        required:[true,"A listing must have a maxGuests "]
    },
    bedrooms:{
        type:Number,
        default:1
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,"Rating must be greater or equal to 1"],
        max:[5,"Rating must be less or equal to 5"],
        set:val=> Math.round(val*10)/10
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,"A listing must have a price"]
    },
    summary:{
        type:String,
        trim:true,
        required:[true,"A listing must have a summary"]
    },
    description:{
        type:String,
        trim:true,
    },
    coverImage:{
        type:String,
        required:[true,"A listing must have a cover image"]
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    category: {
        type:String,
        enum: ["Trending","Rooms","Farms","Arctic","Beach","Castles","Amazing pools","Mountain","Lake","Camping","Domes","Boats","New","Tower","Ski-in","Chef's"],
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    amenities: [String],
    location:{
        //GeoJson
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
    },
    
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
   }
);

listingSchema.index({location:'2dsphere'});



listingSchema.virtual('reviews',{
    ref:"Review",
    foreignField:'listing',
    localField:"_id"
});

listingSchema.pre(/^delete/,function(next){
    next();
});
listingSchema.pre(/^find/,function(next){
    this.populate({
        path:"owner",
        select:"name photo"
    });
    next();
});


const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;