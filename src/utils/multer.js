const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: ""

});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
   destination: function (req, file, cb) {
    cb(null, '/'); 
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded image (you can use a library like 'uuid' for this)
    const uniqueFilename = Date.now() + '-' + file.originalname;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });

module.exports = {upload};
