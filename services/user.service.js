const User = require("../models/user.model");
const { send } = require("../helpers/sendEmail");
const { responseHandler } = require("../helpers/responseHandler");
const { errorMessages, successMessages } = require("../constants/messages");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidV4 } = require("uuid");

exports.createUser = async (req, res) => {
  try {
    const userBody = req.body;
    //Checking if user username already exist
    const userNameExist = await User.findOne({ userName: userBody.userName });
    if (userNameExist) {
      return responseHandler(
        res,
        true,
        StatusCodes.FORBIDDEN,
        errorMessages.USERNAME_ALREADY_IN_USE
      );
    }

    //Checking if user email already exist
    const userExist = await User.findOne({ email: userBody.email });
    if (userExist) {
      return responseHandler(
        res,
        true,
        StatusCodes.FORBIDDEN,
        errorMessages.EMAIL_ALREADY_IN_USE
      );
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
      return responseHandler(
        res,
        -true,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Couldn't send verification email."
      );
    }

    userBody.emailToken = code;
    userBody.emailTokenExpires = new Date(expiry);

    await User.create(userBody);
    return responseHandler(
      res,
      false,
      StatusCodes.CREATED,
      "User Created Successfully"
    );
  } catch (err) {
    return responseHandler(
      res,
      true,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "User Creation failed"
    );
  }
};

exports.findUserById = async (req, res, next) => {
  try {
    var user = await User.findOne({ userId: req.params.userId },{ _id: 0,userId:true,role:true });
    if (!user) {
      return responseHandler(
        res,
        true,
        StatusCodes.NOT_FOUND,
        errorMessages.USER_NOT_FOUND
      );
    } else {
      req.profile = user;
      next();
    }
  } catch (err) {
next()
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    var users = await User.find({},{ _id: 0 }).select("userName email firstName lastName");

    if (!users) {
      return responseHandler(
        res,
        true,
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessages.INTERNAL_SERVER_ERROR
      );
    } else {
      return responseHandler(
        res,
        false,
        StatusCodes.OK,
        successMessages.LIST_OF_RECORDS,
        users
      );
    }
  } catch(err) {
    return responseHandler(
      res,
      true,
      StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

exports.getUserById = async (req, res) => {
  try {
    var user = await User.findOne({userId:req.params.userId},{ _id: 0 }).select("userName email firstName lastName");
    if (!user) {
      return responseHandler(
        res,
        true,
        StatusCodes.NOT_FOUND,
        errorMessages.USER_NOT_FOUND
      );
    } else {
      return responseHandler(
        res,
        false,
        StatusCodes.OK,
        successMessages.YOUR_REQUEST_SUCCESS,
        user
      );
    }
  } catch(err) {
    return responseHandler(
      res,
      true,
      StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const updatedUser = req.body;
    var update = await User.findOneAndUpdate(
      { userId: req.params.userId },updatedUser,{_id:0,new: true}
    ).select("firstName userName");
    if (!update) {
      return responseHandler(
        res,
        true,
        StatusCodes.NOT_MODIFIED,
        errorMessages.INTERNAL_SERVER_ERROR
      );
    } else {
      return responseHandler(
        res,
        false,
        StatusCodes.ACCEPTED,
        successMessages.YOUR_REQUEST_SUCCESS,
        update
      );
    }
  } catch(err) {
    return responseHandler(
      res,
      true,
      StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    User.findByIdAndRemove({ userId: req.params.userId }).catch((err) =>
      err
        ? responseHandler(
            res,
            true,
            StatusCodes.BAD_REQUEST,
            "failed to delete user"
          )
        : responseHandler(
            res,
            false,
            StatusCodes.OK,
            "User deleted successfully"
          )
    );
  } catch(err) {}
};
