const userRoute = require("express").Router();
const argon2 = require("argon2");
const User = require("../models/user");

userRoute.post("/", async (req, res) => {
  const { username, email, password, role, profilePicture, bio, profession } =
    req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const passwordHash = await argon2.hash(password);
  let user = new User({
    username,
    email,
    passwordHash,
    role,
    profilePicture,
    bio,
    profession,
  });
  user = await user.save();
  res.status(201).json({ message: "User Creation Success" });
});

userRoute.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json(user);
});

userRoute.get("/", async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

userRoute.post("/message");

module.exports = userRoute;
