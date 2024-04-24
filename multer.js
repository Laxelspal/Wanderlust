const multer =require("multer");
const AppError =require("./utils/AppError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

module.exports.uploadListingImages =  upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 3 }
])

module.exports.uploadUserPhoto = upload.single('photo');

