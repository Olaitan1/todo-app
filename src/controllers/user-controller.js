const User = require("../model/user");
const {
  registerSchema,
  loginSchema,
  GenerateToken,
  postSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../utils/index");
const { GeneratePassword } = require("../utils/index");
const { GenerateSalt } = require("../utils/index");
const { option } = require("../utils/index");
const bcrypt = require("bcrypt");
const { appSecret, FromAdminMail } = require("../config");
const { emailHtml2, mailSent } = require("../utils/notification");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const RegisterUser = async (req, res) => {
  try {
    const { email, username, password, phoneNumber } = req.body;
    const validateRegister = registerSchema.validate(req.body, option);
    if (validateRegister.error) {
      return res
        .status(400)
        .json({ Error: validateRegister.error.details[0].message });
    }
    //Generate salt
    const salt = await GenerateSalt(10);
    //Encrypting password
    const userPassword = await GeneratePassword(password, salt);
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      if (user.username === username) {
        return res.status(400).json({ Error: "Username already exists" });
      }
      if (user.email === email) {
        return res.status(400).json({ Error: "user email already exists" });
      }
    }

    //create admin
    const superNewAdmin = await User.create({
      username,
      email,
      password: userPassword,
      phoneNumber,
    });
    return res.status(201).json({
      message: "User created successfully",
      newAdmin: superNewAdmin,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};


const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const validateResult = forgotPasswordSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if the User exist
    const oldUser = await User.findOne({ email });

    if (!oldUser) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    const secret = appSecret + oldUser.password;
    const token = await GenerateToken({ email: oldUser.email, id: oldUser.id });

    const link = `${process.env.CLIENT_URL}/forgot-password/?userId=${oldUser.id}&token=${token}`;
    console.log(link);

    const html = emailHtml2(link);
    await mailSent(FromAdminMail, oldUser.email, "Reset your password", html);
    return res.status(200).json({
      message: "password reset link sent to email",
      link,
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error" + error,
      route: "/forgot-password",
    });
  }
};

const resetPasswordGet = async (req, res) => {
  const { userId, token } = req.params;
  const oldUser = await User.findById(userId);

  if (!oldUser) {
    return res.status(400).json({
      message: "User Does Not Exist",
    });
  }

  try {
    const verify = jwt.verify(token, appSecret);
    return res.status(200).json({
      email: oldUser.email,
      verify,
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error" + error,
      route: "/resetpassword/:id/:token",
    });
  }
};

const resetPasswordPost = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const validateResult = resetPasswordSchema.validate(req.body, option);
  if (validateResult.error) {
    return res.status(400).json({
      Error: validateResult.error.details[0].message,
    });
  }
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.status(400).json({
      message: "user does not exist",
    });
  }
  // const secret = appSecret + oldUser.password;
  try {
    const verify = jwt.verify(token, appSecret);
    const salt = await GenerateSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);
    const updatedPassword = await User.updateOne(
      { _id: id },
      { password: encryptedPassword }
    );
    return res.status(200).json({
      message: "you have succesfully changed your password",
      updatedPassword,
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error" + error,
      route: "/resetpassword/:id/:token",
    });
  }
};

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validateRegister = loginSchema.validate(req.body, option);
    if (validateRegister.error) {
      return res
        .status(400)
        .json({ Error: validateRegister.error.details[0].message });
    }
    // Find the admin by email
    const admin = await User.findOne({ email });

    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ error: "Not a registered User" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // Generate and return a token if the login is successful
    const token = await GenerateToken({
      id: admin.id,
      email: admin.email,
    });
    res.status(200).json({ token, admin });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const UpdateUserPassword = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Find the admin by adminId
    const admin = await User.findOne({ _id: adminId });

    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid current password",
      });
    }

    // Generate salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the admin's password
    admin.password = hashedNewPassword;
    await admin.save();

    return res.status(200).json({
      message: "Admin password updated successfully",
    });
  } catch (error) {
    console.error("Error during admin password update:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  RegisterUser,
  ForgotPassword,
  UserLogin,
  resetPasswordGet,
  resetPasswordPost,
  UpdateUserPassword,
};