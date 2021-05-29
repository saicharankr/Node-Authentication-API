const { Strategy, ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const secret = process.env.SECRET;
const mongoose = require("mongoose");

const User = require("./models/userModel");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};
//this sets how we handle tokens coming from the requests that come
// and also defines the key to be used when verifying the token.
module.exports = (passport) => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id)
        .then((user) => {
          if (user) {
            return done(null, {
              id: user.id,
              name: user.name,
              email: user.email,
            });
          }
          return done(null, false);
        })
        .catch((err) => console.error(err));
    })
  );
};
