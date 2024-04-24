const cloudinary = require('cloudinary').v2;
const sharp = require("sharp");

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

module.exports.uploadsUser= async (file) => {
    const resizedImageBuffer = await sharp(file.buffer)
      .resize(2100,2000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();


    // Upload resized image to Cloudinary
    return new Promise(resolve=>{
      cloudinary.uploader.upload_stream(
        { folder: 'wanderlust_v1' }, // Optionally specify a folder in Cloudinary and format
        (err, result) => {
          if (err) {
            console.log(err);
            return {message :"Fail"}
          } 
          resolve({
            url:result.secure_url,
            id:result.public_id
          })
        }
      ).end(resizedImageBuffer);
    })
};

module.exports.uploadsListing= async (file) => {
  const resizedImageBuffer = await sharp(file.buffer)
    .resize(2000,1000)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();


  // Upload resized image to Cloudinary
  return new Promise(resolve=>{
    cloudinary.uploader.upload_stream(
      { folder: 'wanderlust_v1' }, // Optionally specify a folder in Cloudinary and format
      (err, result) => {
        if (err) {
          console.log(err);
          return {message :"Fail"}
        } 
        resolve({
          url:result.secure_url,
          id:result.public_id
        })
      }
    ).end(resizedImageBuffer);
  })
};



