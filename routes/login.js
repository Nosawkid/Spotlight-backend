const loginRoute = require("express").Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

loginRoute.post("/", async (req, res) => {
  const { loginId, password } = req.body;
  if (!loginId || !password) {
    return res.status(400).json({ error: "User id or password is missing" });
  }
  const user = await User.findOne({
    $or: [{ username: loginId }, { email: loginId }],
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isPassword = await argon2.verify(user.passwordHash, password);
  if (!isPassword) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }
  const userToken = {
    username: user.username,
    id: user._id,
    role: user.role,
  };
  const token = jwt.sign(userToken, process.env.SECRET, {
    expiresIn: "12h",
  });
  res
    .status(200)
    .json({ token, id: user._id, username: user.username, role: user.role });
});

module.exports = loginRoute;
