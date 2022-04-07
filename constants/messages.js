 exports.errorMessages = Object.freeze({
  USERNAME_ALREADY_IN_USE: "Username is already in use",
  EMAIL_ALREADY_IN_USE:"Email is already in use",
  ACCOUNT_NOT_FOUND:"Account not found",
  VERIFY_EMAIL:"Please activate your account,with the Activation code sent to your email",
  PASSWORD_INCORRECT:"Incorrect password",
  LOGIN_FAILED:"Couldn't login. Please try again later.",
  NULL_REQUEST:"Request body is empty",
  INVALID_CODE:"Invalid email or code",
  CODE_EXPIRED:"Token has expired",
  ALREADY_ACTIVATED:"Account already activated",
  ACTIVATION_FAILED:"Sorry your account could not be activated due to server error",
  FORGOT_PASSWORD_FAILED:"Failed to send the password reset link",
  JWT_FAILED:"Couldn't create access token. Please try again later",
  PASSWORD_RESET_TOKEN_INVALID:"Password reset token is invalid or has expired.",
  PASSWORD_RESET_FAILED:"Password reset failed",
  USER_NOT_FOUND:"User not found.",
  INTERNAL_SERVER_ERROR:"Internal server error."
});
exports.successMessages = Object.freeze({
  LOGIN_SUCCESSFUL: "User logged in successfully",
  ACTIVATED:"Account activated successfully",
  FORGOT_PASSWORD_SUCCESS:"Email with password reset link is sent",
  PASSWORD_RESET_SUCCESS:"Password has been changed",
  LIST_OF_RECORDS: "List of records",
  YOUR_REQUEST_SUCCESS : " Your request is successful."
});


