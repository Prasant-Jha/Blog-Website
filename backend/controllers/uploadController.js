// controllers/uploadController.js
export const handleInlineImageUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Public URL (adjust depending on deployment setup)
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
