if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const app = require("./app");
const port= 8080;
const mongoose= require('mongoose');

let DBUrl = process.env.MongoDBUrl;
const url = "mongodb://127.0.0.1:27017/Wanderlust";

process.on('uncaughtException',err=>{
    console.log("Uncatch Excption ! shutting Down .....");
    console.log(err.name,err.message);
    process.exit(1);
});

main()
    .then(()=>{
        console.log("Database is connected");
    })
    .catch((err)=>{
        console.log(err);
    })


async function main() {
    await mongoose.connect(DBUrl);
}


app.listen(port,(req,res)=>{
    console.log(`app is listening on port  ${port}`)
});

process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log("Unhandled Rejection!  shutting Down ....");
    server.close(()=>{
        process.exit(1);
    });
});

// console.log(x);
