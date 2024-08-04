const dotenv = require ('dotenv')

dotenv.config()
module.exports = {
  appSecret: process.env.appSecret,
  cloudName: process.env.cloudName,
  cloudKey: process.env.cloudKey,
  cloudSecret: process.env.cloudSecret,
  FromAdminMail: process.env.FromAdminMail,
  userSubject: process.env.usersubjec,
  GMAIL_PASS: process.env.GMAIL_PASS,
  GMAIL_USER: process.env.GMAIL_USER,
};