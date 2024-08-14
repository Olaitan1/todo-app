const Joi =require ("joi");
const bcrypt =require  ('bcrypt');
const jwt = require('jsonwebtoken');
const {appSecret} = require('../config/index')
const payload = require ('../dto/user.dto')

const registerSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    confirm_password: Joi.any()
    .required()
    .valid(Joi.ref("password"))
    .label("confirm password")
    .messages({"any.only": "passwords do not match"}),
    //.messages({ "any.only": "{{#label}} does not match with password" }),
})

const descriptionSchema = Joi.object({
  heading: Joi.string().optional(),
  content: Joi.string().required(),
});

// Joi schema for the PostSchema
const postSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.array().items(descriptionSchema).required(),
  category: Joi.string().required(),
  author: Joi.string().required()
});



const likeSchema = Joi.object().keys({
  // Define any relevant fields for a like here
  title: Joi.string().optional(),
});

const resetPasswordSchema = Joi.object().keys({
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
  //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
 
});

const option = {
  abortEarly: false,
  // allowUnknown: true,
  // stripUnknown: true,
  errors: {
    wrap: {
      label: ''
    }
  }
};
const GenerateSalt = async (rounds) => {

  try {
    const salt = await bcrypt.genSalt(10);
    return salt;
  } catch (error) {
    // Handle error
    console.error(error);
    throw error;
  }
};

const GeneratePassword = async (password ,salt) => {

  try {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    // Handle error
    console.error(error);
    throw error;
  }
};
const GenerateToken = async (payload) =>
{
  return jwt.sign(payload,  appSecret, {expiresIn: '1d'})   
}

 const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().required(),
});


// export const updateSchema = Joi.object().keys({
//   address: Joi.string().required(), 
//   firstName: Joi.string().required(),
//   lastName: Joi.string().required(),
//   phone: Joi.string().required()
// });
// export const Adminschema = Joi.object().keys({
//   firstName: Joi.string().required(),
//   lastName: Joi.string().required(),
//   address: Joi.string().required(),
//   phone: Joi.string().required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
// });


module.exports = {
  registerSchema,
  option,
  GeneratePassword,
  GenerateSalt,
  loginSchema,
  GenerateToken,
  postSchema,
  likeSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};