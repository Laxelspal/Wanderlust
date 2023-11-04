const mongoose= require("mongoose");
const Listing = require("../Model/Listing.js");
const initDB= require("./data.js");

main().then(()=>{
    console.log("Database is connected");
})
.catch((err)=>{
   console.log(err);
})

async function main() {
await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initilData = async()=>{
    await  Listing.deleteMany({});
    initDB.data = initDB.data.map((listing)=>({...listing,owner:"652e639484d75c10627f769b"}));
    await Listing.insertMany(initDB.data);
    console.log("Data is initialized");
}
initilData();