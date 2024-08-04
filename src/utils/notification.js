const nodemailer = require ("nodemailer");
const {FromAdminMail, userSubject} = require ('../config')

const transport = nodemailer.createTransport({
  service: "gmail" /*service and host are the same thing */,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

 const mailSent = async (
  from,
  to,
  subject,
  html
) => {
  try {
    const response = await transport.sendMail({
      from: FromAdminMail,
      to,
      subject: userSubject,
      html,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};
const emailHtml2 = (link) => {
  let response = `
    <div style="max-width:700px;
    margin:auto;
    border:10px solid #ddd;
    padding:50px 20px;
    font-size: 110%;
    font-style: italics
    "> 
    <h2 style="text-align:center;
    text-transform:uppercase;
    color:teal;
    ">
    Gurusys
    </h2>
    <p>Hi there, follow the link to reset your password. The link expires in 10 minutes below.</p>
     <a href=${link}>Reset Password</a>
     <h3>DO NOT DISCLOSE TO ANYONE<h3>
     </div>`;

  return response;
};
module.exports = {mailSent, emailHtml2}
