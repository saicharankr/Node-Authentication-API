const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const { logger } = require("../helpers/logging");
const { v4: uuidV4 } = require("uuid");
const { sendEmail } = require("../helpers/sendEmail");
const { generateJwt } = require("../helpers/generateJWT");

require("dotenv").config();

exports.signUp = async (req, res) => {
  try {
    const result = req.body;
    //Assigning the userId
    var id = uuidV4();
    result.userId = id;

    let code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    let expiry = Date.now() + 60 * 1000 * 15; //Set expiry 15 mins ahead from now

    result.emailToken = code;
    result.emailTokenExpires = new Date(expiry);

    const newUser = await new User(result);
    newUser.save();

    const sendCode = await sendMail(result.email, code);

    if (sendCode.error) {
      console.log(sendCode.error);
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Registration Success",
    });
  } catch (err) {
    // logger.error(err);
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
    });
  }
};

exports.signin = (req, res) => {
  try {
    const { email, password } = req.body;

    //Checking If email exist
      User.findOne({ email }, async (err, user) => {
      if (err || !user) {
        return res.status(404).json({
          error: true,
          message: "Account not found",
        });
      }
      

      //2. Throw error if account is not activated
      if (!user.active) {
        return res.status(400).json({
          error: true,
          message: "You must verify your email to activate your account",
        });
      }

      //Check Password
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: true,
          message: "Invalid credentials",
        });
      }
      const { error, token } = await generateJwt(user.userId);
      console.log(token);
      console.log(error);
      if (error) {
        return res.status(500).json({
          error: true,
          message: "Couldn't create access token. Please try again later",
        });
      }
      res.cookie("t", token, { expire: new Date() + 9999 });

      return res.send({
        success: true,
        message: "User logged in successfully",
      });
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

exports.Activate = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.json({
        error: true,
        status: 400,
        message: "Please make a valid request",
      });
    }
    const user = await User.findOne({
      email: email,
      emailToken: code,
      emailTokenExpires: { $gt: Date.now() }, // check if the code is expired
    });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid details",
      });
    } else {
      if (user.active)
        return res.send({
          error: true,
          message: "Account already activated",
          status: 400,
        });

      user.emailToken = "";
      user.emailTokenExpires = null;
      user.active = true;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Account activated.",
      });
    }
  } catch (error) {
    console.error("activation-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

async function sendMail(email, code) {
  let subject = "Verification email";
  var body_html = `<!DOCTYPE> 
    <html>
      <body>
        <p>Your authentication code is : </p> <b>${code}</b>
      </body>
    </html>`;

  var emailInfo = {
    toEmail: email,
    subject: subject,
    body_html: body_html,
  };

  return await sendEmail(emailInfo);
}
