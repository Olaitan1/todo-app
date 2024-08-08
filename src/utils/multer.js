const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: "djpfqql7d",
  api_key: "889975425699622",
  api_secret: "MC4kahLCgyqLbe2GkHkALJDvc5Y",
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
