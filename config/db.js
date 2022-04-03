const mongoose = require("mongoose");

exports.connect =(dataBaseurl) => {
   mongoose
    .connect(dataBaseurl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB connected"));

   mongoose.connection.on("error", (err) => {
    console.log(err);
  });
};
