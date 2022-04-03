//module imports
const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const { connect } = require("./config/db");
const { routes } = require("./routes/index");
const passport = require('passport');
const {passportStrategy} = require('./config/passport.config');
dotenv.config();

//connect to database
connect(process.env.MONGO_URI);


//use middleware
app.use(cors());
app.use(passport.initialize());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());

//passport config settings
passportStrategy();

//bring in routes
// register routes
routes(app);


app.set("port", process.env.PORT || 8080);

//handling the authorization for routes
app.use(function (err, req, res, next) {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized !!" });
  }
});

app.listen(app.get("port"), function () {
  console.log("App is running, server is listening on port ", app.get("port"));
});
