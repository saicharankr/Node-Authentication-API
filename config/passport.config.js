const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const User = require("../models/user.model");

exports.passportStrategy = async () =>{
    let options = {}
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = process.env.JWT_SECRET;
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {
      User.findOne({id: jwt_payload.sub},{_id:0,userId:true,role:true}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              return done(null, user);
          } else {
              return done(null, false);
              // or you could create a new account
          }
      });
    }));
    }