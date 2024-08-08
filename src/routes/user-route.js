const router = require('express').Router();
const {upload} = require('../../src/utils/multer');
const {
  RegisterUser,
  UserLogin,
  ForgotPassword,
  resetPasswordGet,
  UpdateUserPassword,
  UpdateProfile,
} = require("../controllers/user-controller");
const { auth, protect } = require('../middleware/authorization');

router.post('/register',RegisterUser)

router.post("/login", UserLogin);

router.post("/forgot-password", ForgotPassword);

router.get("/resetpassword/:userId/:token", resetPasswordGet);

router.patch("/admins/:adminId/password", protect, UpdateUserPassword);


router.patch('/user/:id',protect, upload.single('profilePicture'), UpdateProfile);


module.exports = router;