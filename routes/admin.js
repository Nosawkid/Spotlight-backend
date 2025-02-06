const adminRoute = require("express").Router();
const Profession = require("../models/profession");
const Application = require("../models/application");
const { userExtractor, adminExtractor } = require("../utils/middleware");

// Add Professions
adminRoute.post(
  "/profession",
  userExtractor,
  adminExtractor,
  async (req, res) => {
    const { professionTitle } = req.body;
    let profession = await Profession.findOne({ professionTitle });
    if (profession) {
      return res.status(400).json({ message: "Profession already exists" });
    }
    profession = new Profession({
      professionTitle,
    });
    profession = await profession.save();
    res.status(200).json({ message: "Profession added successfully" });
  }
);

// View all application
adminRoute.get("/applications", userExtractor, async (req, res) => {
  const applications = await Application.find({}).populate("projectId");
  res.status(200).json(applications);
});

module.exports = adminRoute;
