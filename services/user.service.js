const User = require("../models/user.model");
const { send } = require("../helpers/sendEmail");
const {responseHandler} = require("../helpers/responseHandler");
const {errorMessages,successMessages} =require("../constants/messages");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidV4 } = require("uuid");

exports.createUser = async (req,res) => {
  try {
    const userBody= req.body;
    //Checking if user username already exist
    const userNameExist = await User.findOne({ userName: userBody.userName });
    if (userNameExist) {
        return responseHandler(res,true,StatusCodes.FORBIDDEN,errorMessages.USERNAME_ALREADY_IN_USE)
    }

    //Checking if user email already exist
    const userExist = await User.findOne({ email: userBody.email });
    if (userExist) {
      return responseHandler(res,true,StatusCodes.FORBIDDEN,errorMessages.EMAIL_ALREADY_IN_USE);
    }

    //Assigning the userId
    var id = uuidV4();
    userBody.userId = id;

    let code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    let expiry = Date.now() + 60 * 1000 * 15; //Set expiry 15 mins ahead from now

    //sending email with code for activation
    const sendCode = await send(
      userBody.email,
      "Activate Your Account",
      "To activate you account please use the code",
      code
    );

    if (sendCode.error === true) {
      return responseHandler(res,true,StatusCodes.INTERNAL_SERVER_ERROR,"Couldn't send verification email.");
    }
 
    userBody.emailToken = code;
    userBody.emailTokenExpires = new Date(expiry);

    await User.create(userBody);
    return responseHandler(res,false,StatusCodes.CREATED,"User Created Successfully");
  } catch (err) {
    return responseHandler(res,true,StatusCodes.INTERNAL_SERVER_ERROR,"User Creation failed");
  }
};
