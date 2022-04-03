const cleanBody = require("../middlewares/cleanbody");
const {signUpValidations,signinValidations,forgotPasswordValidations,resetPasswordValidations}=require("../validators/validators");
const{ signUp,signin,Activate,ForgotPassword,ResetPassword,signout} = require("../controllers/auth.controller");
const express = require("express");
const cleanbody = require("../middlewares/cleanbody");
const router = express.Router();


router.post("/signin",cleanBody,signinValidations,signin);
router.post("/activate",cleanbody,Activate);
router.post("/signup",cleanBody,signUpValidations,signUp);
router.post("/forgot-password",cleanBody,forgotPasswordValidations,ForgotPassword);
router.post("/reset-password",cleanBody,resetPasswordValidations,ResetPassword);
router.get("/signout",signout);

module.exports = router;