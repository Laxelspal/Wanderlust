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
    initDB.data = initDB.data.map((listing)=>({...listing,owner:"663b45d92cb08f5229c17fd5"}));
    await Listing.insertMany(initDB.data);
    console.log("Data is initialized");
}
initilData();