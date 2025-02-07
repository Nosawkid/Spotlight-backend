const { application } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  applicationStatus: {
    type: Number,
    default: 0,
  },

  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
