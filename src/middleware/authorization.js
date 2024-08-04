const jwt = require('jsonwebtoken');
const {appSecret} = require('../config/index')
const User = require('../model/user');



const protect = async (req, res, next) => {
  let token = "";

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized, you have no access token, please login",
    });
  }

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        const { id } = jwt.verify(token, appSecret || "");
      const user = await User.findById(id).exec()

      if (!user) {
        throw new Error("Not Authorized");
      }

      req.user = user;
      next();
    } else {
      throw new Error("Invalid token format");
    }
  } catch (error)
  {
    return res.status(401).json({
      error: error.message,
        message: "You are not a valid user, please login",
      
    } );
      
  }
};




module.exports = { protect};