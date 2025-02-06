const cloudinary = require("../utils/cloudinaryConfig");
const fs = require("fs");

const uploadImg = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "projects", // Store in "projects" folder
    });

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    // Attach image URL to request object
    req.imageUrl = result.secure_url;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

module.exports = { uploadImg };
