const User = require("../models/user.model");
const _ = require("lodash")

exports.userById = (req, res, next, id) => {
  try{
      User.findOne({userId:id}).exec((err, user) => {
          if (err || !user) {
              return res.status(400).json({
                  error: true,
                  message:"User Not Found"
              });
          }
          req.profile = {userId:user.userId,role:user.role};
          next();
      });
  }catch(err){
      return res.status(400).json({
          error: true,
          message:err
      });
  }
};



exports.getAllUsers = (req, res) => {
  User
    .find((err, users) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({ users });
    })
    .select("username email created updated");
};

exports.getSingleUser=(req,res) => {
    req.profile.hashed_password = undefined
    req.profile.salt=undefined
    return res.json(req.profile);
}

// exports.getSingleUser = (req, res) => {
// //   User
// //     .findById({ _id: req.params.id }, (err, user) => {
// //       if (err || !user) {
// //         return res.status(400).json({
// //           error: "User does not exist",
// //         });
// //       }
// //       res.json({ user });
// //     })
// //     .select("username email created updated");
// };

exports.updateUser = (req, res) => {
  let user = req.profile
  user = _.extend(user,req.body)
  user.updated = Date.now()
  user.save((err) => {
    if(err){
      return res.status(400).json({
        error:err
      })
    }
    user.hashed_password = undefined
    user.salt=undefined
    res.json({user})
  })
};

exports.deleteUser = (req,res) => {
  let user =req.profile
  user.remove((err) => {
    if(err){
      res.status(400).json({
        error:err
      })
      res.status(200).json({
        message:"Your account is deleted"
      })
    }
  })
  
}
