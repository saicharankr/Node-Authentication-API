const nodemailer = require("nodemailer");
require("dotenv").config();


exports.emailSettings = async (contentObj) => {
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
      secure: false, // true for 465, false for other ports
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
    };
  }
};

exports.send =  async (email, subject, message, code) => {
    var body_html = `<!DOCTYPE> 
      <html>
        <body>
          <p> ${message} : </p> <b> ${code} </b>
        </body>
      </html>`;
  
    var emailInfo = {
      toEmail: email,
      subject: subject,
      body_html: body_html,
    };
    return await this.emailSettings(emailInfo);
}