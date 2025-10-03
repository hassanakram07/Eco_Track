const mongoose = require("mongoose");
const config = require("config");

mongoose
  .connect(`${config.get("MONGODB_URI")}/EcoTrack`)
  .then(function () {
    console.log("connected");
  })
  .catch(function (err) {
    console.error(err.message);
  });
  module.exports = mongoose.connection;
