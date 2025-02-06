const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  artistId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  makerId: {
    type: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
});

module.exports = mongoose.model("Chat", chatSchema);
