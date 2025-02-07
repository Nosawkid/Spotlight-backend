const makerRoute = require("express").Router();
const Project = require("../models/project");
const { uploadImg } = require("../controllers/uploadController");
const multer = require("multer");
const Application = require("../models/application");
const User = require("../models/user");
const Profession = require("../models/profession");

const upload = multer({ dest: "uploads/" });

// Add Project
makerRoute.post(
  "/project",
  upload.single("projectImg"),
  uploadImg,
  async (req, res) => {
    const {
      projectTitle,
      projectDesc,
      professions,
      postedBy,
      gender,
      experience,
      minAgeRequirement,
      maxAgeRequirement,
    } = req.body;
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
      postedBy,
      gender,
      experience,
      minAgeRequirement,
      maxAgeRequirement,
    });
    project = await project.save();
    res.status(200).json({ message: "Project Creation success" });
  }
);

// Get Ongoing Project
makerRoute.get("/project-ongoing", async (req, res) => {
  const project = await Project.find({ projectStatus: 0 }).populate(
    "professions"
  );
  res.status(200).json(project);
});
makerRoute.get("/project-ongoing/:id", async (req, res) => {
  const id = req.params.id;
  const project = await Project.find({
    projectStatus: 0,
    postedBy: id,
  }).populate("professions");
  res.status(200).json(project);
});

// Get finished Project
makerRoute.get("/project-complete", async (req, res) => {
  const project = await Project.find({ projectStatus: 1 }).populate(
    "professions"
  );
  res.status(200).json(project);
});
makerRoute.get("/project-complete/:id", async (req, res) => {
  const id = req.params.id;
  const project = await Project.find({
    projectStatus: 1,
    postedBy: id,
  }).populate("professions");
  res.status(200).json(project);
});

makerRoute.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;

    // Find professions that contain the query (case-insensitive)
    const professions = await Profession.find({
      professionTitle: { $regex: query, $options: "i" },
    });

    // Extract profession IDs
    const professionIds = professions.map((prf) => prf._id);

    // Find users where name or profession matches the query
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } }, // Matches similar names
        { profession: { $in: professionIds } }, // Matches similar professions
      ],
    }).populate({ path: "profession" });

    res.status(200).json(users);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Mark as finish
makerRoute.put("/finish-project/:id", async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, {
    projectStatus: 1,
  });
  res.status(200).json("Project Updated");
});

// Get specific Project
makerRoute.get("/project/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id).populate({ path: "professions" });
  res.status(200).json(project);
});

// Complete Project
makerRoute.put("/project/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate({ projectStatus: 1 });
  res.status(200).json(project);
});

// Get applications of a project
makerRoute.get("/application/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const applications = await Application.find({ projectId }).populate({
    path: "userId",
  });
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

makerRoute.put("/add-exp/:id", async (req, res) => {
  const { expTitle, expDesc, expLink } = req.body;
  const id = req.params.id;
  const user = await User.findById(id);
  user.experience.push({
    expTitle,
    expDesc,
    expLink,
  });

  await user.save();
  res.status(200).json("Experience Added");
});

makerRoute.get("/recommendations/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    // Fetch the project details
    const project = await Project.findById(projectId).populate("professions");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Build query conditions
    let query = {};

    // Match users by profession (if project has professions listed)
    if (project.professions.length > 0) {
      query.profession = { $in: project.professions.map((p) => p._id) };
    }

    // Match users by age range (if project has age requirements)
    if (project.minAgeRequirement !== undefined) {
      query.age = { $gte: project.minAgeRequirement };
    }
    if (project.maxAgeRequirement !== undefined) {
      query.age = { ...query.age, $lte: project.maxAgeRequirement };
    }

    // Match users by gender (if project has a specific gender requirement)
    if (project.gender) {
      query.gender = project.gender;
    }

    // Find users matching the criteria
    const recommendedUsers = await User.find(query);

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Maker details
makerRoute.get("/:id", async (req, res) => {
  const id = req.params.id;
  const maker = await User.findById(id);
  if (maker) {
    res.status(200).json(maker);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = makerRoute;
