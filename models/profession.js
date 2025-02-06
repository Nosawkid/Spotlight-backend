const mongoose = require("mongoose");
const { Schema } = mongoose;

const professionSchema = new Schema({
  professionTitle: {
    type: String,
    required: [true, "Profession title cannot be empty"],
  },
});

module.exports = mongoose.model("Profession", professionSchema);
