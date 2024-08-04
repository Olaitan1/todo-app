const router = require('express').Router();
const {
  RegisterUser,
  UserLogin,
  ForgotPassword,
  resetPasswordGet,
  UpdateUserPassword,
} = require("../controllers/user-controller");
const { auth, protect } = require('../middleware/authorization');

router.post('/register',RegisterUser)

router.post("/login", UserLogin);

router.post("/forgot-password", ForgotPassword);

router.get("/resetpassword/:userId/:token", resetPasswordGet);

router.patch("/admins/:adminId/password", protect, UpdateUserPassword);

module.exports = router;