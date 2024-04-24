const mongoose= require("mongoose");
const Listing = require("../Model/listingModel.js");
const initDB= require("./data.js");


main().then(()=>{
    console.log("Database is connected");
})
.catch((err)=>{
   console.log(err);
})
async function main() {
await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

const initilData = async()=>{
    await  Listing.deleteMany({});
    initDB.data = initDB.data.map((listing)=>({...listing,owner:"662866dad32b6b4395d833d1"}));
    await Listing.insertMany(initDB.data);
    console.log("Data is initialized");
}
initilData();