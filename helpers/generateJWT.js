const jwt = require("jsonwebtoken");
require("dotenv").config();


async function generateJwt(userId) {
  try {
    const payload = { id: userId};
    const expiresIn = '7d';
    const token = await jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:expiresIn});
    return { error: false, token: token ,expire:expiresIn};
  } catch (error) {
    return { error: true };
  }
}

module.exports = { generateJwt };