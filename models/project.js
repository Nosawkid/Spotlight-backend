const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectTitle: {
    type: String,
    required: [true, "Project title cannot be empty"],
  },
  projectDesc: {
    type: String,
    required: [true, "Project Description cannot be empty"],
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  projectImg: {
    type: String,
  },
  professions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Profession",
    },
  ],
  applications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
});

projectSchema.set("toJSON", {
  transform: (document, returnObj) => {
    returnObj.id = returnObj._id;
    delete returnObj._id;
    delete returnObj.__v;
  },
});

module.exports = mongoose.model("Project", projectSchema);
