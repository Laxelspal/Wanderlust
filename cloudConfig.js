const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require("fs");

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'wanderlust_DEV',
//       allowerdFormat: ["png","jpg","jpeg"], // supports promises as well
//     },
// });

module.exports.uploads = async (file)=>{
    return new Promise(resolve=>{
      cloudinary.uploader.upload(file,(err,result)=>{
        if(err) return {message :"Fail"}
        resolve({
          url:result.secure_url,
          id:result.public_id
        })
      })
    })
}

// async function uploadToCloudinary(file) { 
   
//   const folder = "Image" +"/";
//   console.log(folder);
//   return cloudinary.uploader 
//       .upload(file, { public_id : "Image" }) 
//       .then((result) => { 
//           console.log(result);
//           fs.unlinkSync(file);
//           return { 
//               message:"success", 
//               url: result.url,
     
//           }; 
//       }) 
//       .catch((error) => { 
//           fs.unlinkSync(file);
//           return { message: "Fail" }; 
//       }); 
// }



