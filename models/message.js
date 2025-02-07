const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
  },
  senderId: {
    type: Schema.Types.ObjectId,
  },
  isArtist: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Message", messageSchema);
