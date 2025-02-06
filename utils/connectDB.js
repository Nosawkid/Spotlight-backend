const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connection = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MONGODB");
  })
  .catch((err) => {
    console.log("Mongo Connection Failed");
    console.log(err);
  });

module.exports = connection;
