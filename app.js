//import required modules
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
dotenv.config();

//initializing the  express
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.set("port", process.env.PORT || 8080);

//connecting the mongoDb
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"));

mongoose.connection.on("error", (err) => {
  console.log(err);
});

//bring in routes
const authRoutes=require("./routes/auth") ;

//use middleware
app.use(morgan("dev"));
app.use(expressValidator());
app.use(cookieParser());

//Routes
app.use('/',authRoutes);

//swagger-document
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ECommerce Documentation",
      version: "1.0.0",
      description: "ECommerce Application api Documentation",
      license: {
        name: "",
        url: "",
      },
      contact: {
        name: ":- K.R.SAI CHARAN",
        url: "www.saicharankr.tech",
        email: "saicharankr@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/",
      },
    ],
  },
  apis: ["./routes/users.js"],
};

const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.listen(app.get("port"), function () {
  console.log("App is running, server is listening on port ", app.get("port"));
});
