const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username cannot be empty"],
  },
  email: {
    type: String,
    required: [true, "Email cannot be empty"],
    unique: true,
  },
  passwordHash: {
    type: String,
    required: [true, "Password Hash cannot be empty"],
  },
  role: {
    type: String,
    required: [true, "Role cannot be empty"],
    enum: ["artist", "admin", "filmmaker"],
    default: "artist",
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
  },
  rating: {
    type: String,
    max: 5,
  },
  experience: [
    {
      expTitle: {
        type: String,
        required: [true, "Experience title cannot be empty"],
      },
      expDesc: {
        type: String,
        required: true,
      },
      expLink: {
        type: String,
      },
    },
  ],
  profession: {
    type: Schema.Types.ObjectId,
    ref: "Profession",
  },
  workHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  verificationStatus: {
    type: Number,
    default: 0,
  },
  age: {
    type: Number,
    min: 0,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
});

userSchema.set("toJSON", {
  transform: (document, returnObj) => {
    returnObj.id = returnObj._id.toString();
    delete returnObj._id;
    delete returnObj.__v;
    delete returnObj.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
