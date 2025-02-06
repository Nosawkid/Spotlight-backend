const artistRoute = require("express").Router();
const Application = require("../models/application");
const Project = require("../models/project");

// Apply for a project
artistRoute.post("/application/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "No project found" });
  }

  const { message } = req.body;
  let application = new Application({
    message,
    projectId,
  });
  application = await application.save();
  res.status(200).json({ message: "Application submitted successfully" });
});

module.exports = artistRoute;
