const { StatusCodes } = require("http-status-codes");
const { errorMessages ,successMessages} = require("../constants/messages");
const { send } = require("../helpers/sendEmail");
const { responseHandler } = require("../helpers/responseHandler");
const User = require("../models/user.model");
const {generateJwt} = require("../helpers/generateJWT");


exports.loginUser = async (req,res) => {
  try {
    const { email, password } = req.body;

    //Checking if user email already exist
    const user = await User.findOne({ email });
    if (!user) {
      return responseHandler(res,true,StatusCodes.NOT_FOUND,errorMessages.ACCOUNT_NOT_FOUND);
    }

    //verifying email account
    if (!user.active) {
      return responseHandler(res,true,StatusCodes.FORBIDDEN,errorMessages.VERIFY_EMAIL);
    }

    //Check Password
    const authenticate = await user.authenticate(password);
    if (!authenticate) {
      return responseHandler(res,true,StatusCodes.UNAUTHORIZED,errorMessages.PASSWORD_INCORRECT);
    }

    //jwt token
    const { error, token,expire } = await generateJwt(user.userId);
    if (error) {
      return responseHandler(res,true,StatusCodes.INTERNAL_SERVER_ERROR,errorMessages.JWT_FAILED);
    }

    //response data
    const data = {
      token:token,
      expire:expire,
      user:{
        id:user._id,
        email:user.email,
        first_name:user.firstName,
        last_name:user.lastName,
        user_name:user.userName,
        role:user.role
      }
    }
    return responseHandler(res,false,StatusCodes.OK,successMessages.LOGIN_SUCCESSFUL,data)
  } catch (err) {
    return responseHandler(res,true,StatusCodes.INTERNAL_SERVER_ERROR,errorMessages.LOGIN_FAILED)
  }
};

exports.activeUser = async (req,res) => {
  try {
    const requestBody = req.body;

    //checking if the email and code in the request body is not null
    if (!requestBody) {
      responseHandler(res,true,StatusCodes.BAD_REQUEST,errorMessages.NULL_REQUEST);
    }

    const user = await User.findOne({email:requestBody.email,emailToken:requestBody.code,emailTokenExpires:{$gt:Date.now()}})
    
    //checking if it is a valid code
    if(!user){
      return responseHandler(res,true,StatusCodes.BAD_REQUEST,errorMessages.INVALID_CODE);
    }
    // //checking the code expire
    // else if(!(user.emailTokenExpires - Date.now().getMinutes() <= 15 )){
    //   return responseHandler(res,true,StatusCodes.BAD_REQUEST,errorMessages.CODE_EXPIRED);
    // }
    //checking if user is already activated
    else if(user.active){
      return responseHandler(res,true,StatusCodes.BAD_REQUEST,errorMessages.ALREADY_ACTIVATED);
    }
      user.emailToken = "";
      user.emailTokenExpires = null;
      user.active = true;

      await user.save();

      return responseHandler(res,false,StatusCodes.OK,successMessages.ACTIVATED)
  } catch (error) {
    return responseHandler(res,true,StatusCodes.INTERNAL_SERVER_ERROR,errorMessages.ACTIVATION_FAILED);
  }
};

exports.forgotPassword = async (req,res) => {
  try {
    const requestBody = await req.body;

    const user = await User.findOne({email: requestBody.email});
    if (!user) {
      return responseHandler(res,true,StatusCodes.NOT_FOUND,errorMessages.ACCOUNT_NOT_FOUND);
    }

    const code = Math.floor(100000 + Math.random() * 900000);

    let link = `${process.env.CLIENT_URL}/resetPassword/code=${code}`;

    const  sendPasswordResetLink = await send( user.email,"Reset Password","Password Reset link",link);

    if (sendPasswordResetLink.error === true) {
      return responseHandler(res,true,StatusCodes.INTERNAL_SERVER_ERROR,"Couldn't send verification email.");
    }

    user.resetPasswordToken = code;
    user.resetPasswordExpires = Date.now() + 60 * 1000 * 15;; // 15 minutes

    await user.save();
    
    return responseHandler(res,false,StatusCodes.OK,successMessages.FORGOT_PASSWORD_SUCCESS);
  } catch (error) {
    return responseHandler(res,true,StatusCodes.INTERNAL_SERVER_ERROR,errorMessages.FORGOT_PASSWORD_FAILED);
  }
};

exports.resetPassword = async (req,res) =>{
  try {
   const  requestBody = req.body;
    if (!requestBody) {
      responseHandler(res,true,StatusCodes.BAD_REQUEST,errorMessages.NULL_REQUEST);
    }

    const user = await User.findOne({resetPasswordToken: requestBody.token});

    if (!user) {
      responseHandler(res,true,StatusCodes.BAD_REQUEST,errorMessages.PASSWORD_RESET_TOKEN_INVALID);
    }
    //checking the code expire
    else if(!(user.resetPasswordExpires.getMinutes() - Date.now().getMinutes() <= 15 )){
      return responseHandler(res,true,StatusCodes.BAD_REQUEST,errorMessages.CODE_EXPIRED);
    }

    user.hashed_password = await user.encryptPassword(requestBody.newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = "";

    await user.save();

    return responseHandler(res,false,StatusCodes.OK,successMessages.PASSWORD_RESET_SUCCESS);
  } catch (error) {
    return responseHandler(res,true,StatusCodes.INTERNAL_SERVER_ERROR,errorMessages.PASSWORD_RESET_FAILED);
  }
};



