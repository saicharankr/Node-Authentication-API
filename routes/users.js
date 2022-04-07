const {userById, getAllUsers, getUserById,updateUser,deleteUser} = require("../controllers/user.controller");
const express = require("express");
const { requireSignin,isAuth } = require("../controllers/auth.controller");
const router = express.Router({mergeParams: true});


router.get('/users',requireSignin,getAllUsers);
router.get('/user/:userId',requireSignin,getUserById);
router.put('/user/:userId',requireSignin,isAuth,updateUser);
router.delete('/user/:userId',requireSignin,isAuth,deleteUser)

//whenever in the router :userId is found it executes userById()
router.param("userId", userById);

module.exports  = router;