const chatRoute = require("express").Router();
const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user");
const message = chatRoute.post("/", async (req, res) => {
  const { artistId, makerId } = req.body;

  try {
    // Check if a chat already exists
    let chat = await Chat.findOne({ artistId, makerId });

    if (chat) {
      return res.status(200).json(chat); // Return existing chat
    }

    // Create a new chat if none exists
    chat = new Chat({ artistId, makerId });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error in chat creation:", error);
    res.status(500).json({ message: "Server error" });
  }
});

chatRoute.post("/send/:mid", async (req, res) => {
  const { mid } = req.params;
  let isArtist;
  const chat = await Chat.findById(mid);
  const { senderId, content } = req.body;
  const user = await User.findById(senderId);
  if (user.role === "artist") {
    isArtist = true;
  }
  const message = new Message({
    chatId: mid,
    senderId,
    content,
    isArtist,
  });
  await message.save();
  res.status(201).json({ message: "message sent" });
});

chatRoute.get("/:id", async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  res.status(200).json(chat);
});

module.exports = chatRoute;
