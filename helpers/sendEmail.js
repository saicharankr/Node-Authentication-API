const nodemailer = require("nodemailer");
require("dotenv").config();
const {logger}=require('./logging')

async function sendEmail (contentObj) {
  try {
    const smtpServer = process.env.SMTP_SERVER;
    const smtpPort = process.env.SMTP_PORT;
    const senderAddress = process.env.SENDER_ADDRESS;
    const smtpUser = process.env.SMTP_USER_NAME;
    const smtpPassword = process.env.SMTP_PASSWORD;

    const { toEmail, subject, body_html } = contentObj;

    // Create the SMTP transport.
    let transporter = nodemailer.createTransport({
      host: smtpServer,
      port: smtpPort,
      secure: true, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    let mailOptions = {
      from: senderAddress,
      to: toEmail,
      subject: subject,
      html: body_html,
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return {error:true};
      }
      console.log(info.message)
    });
    
    return {error:false};
  } catch (e) {
    // logger.error(e);
    console.log(e)
    return {
      error: true,
      message: "Cannot send email",
    };
  }
};

module.exports={sendEmail};