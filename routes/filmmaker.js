const makerRoute = require("express").Router();
const Project = require("../models/project");
const { uploadImg } = require("../controllers/uploadController");
const multer = require("multer");
const Application = require("../models/application");

const upload = multer({ dest: "uploads/" });

// Add Project
makerRoute.post(
  "/project",
  upload.single("projectImg"),
  uploadImg,
  async (req, res) => {
    const { projectTitle, projectDesc, professions } = req.body;
    if (!projectTitle || !projectDesc) {
      return res
        .status(400)
        .json({ message: "Project title and Description is required" });
    }
    let project = new Project({
      projectTitle,
      projectDesc,
      professions,
      projectImg: req.imageUrl,
    });
    project = await project.save();
    res.status(200).json({ message: "Project Creation success" });
  }
);

// Get specific Project
makerRoute.get("/project/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id).populate("professions");
  res.status(200).json(project);
});

// Get applications of a project
makerRoute.get("/application/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const applications = await Application.findById(projectId);
  res.status(200).json(applications);
});

// Accept Application
makerRoute.put("/application-accept/:appId", async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.appId,
      { applicationStatus: 1 },
      { new: true } // Returns the updated document
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

makerRoute.put("/application-reject/:appId", async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.appId,
      { applicationStatus: 2 },
      { new: true } // Returns the updated document
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = makerRoute;
