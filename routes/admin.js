const adminRoute = require("express").Router();
const Profession = require("../models/profession");
const Application = require("../models/application");
const { userExtractor, adminExtractor } = require("../utils/middleware");

// Add Professions
adminRoute.post("/profession", async (req, res) => {
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
});

// Get all Professions
adminRoute.get("/professions", async (req, res) => {
  const professions = await Profession.find({});
  res.status(200).json(professions);
});

// View all application
adminRoute.get("/applications", async (req, res) => {
  const applications = await Application.find({}).populate("projectId");
  res.status(200).json(applications);
});

module.exports = adminRoute;
