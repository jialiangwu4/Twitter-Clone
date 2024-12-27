import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { image } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // at least one of text or image must be provided
    if (!text && !image) {
      return res.status(400).json({ error: "Please provide text or image" });
    }

    // if image is provided, upload it to cloudinary
    if (image) {
      const result = await cloudinary.uploader.upload(image).catch((error) => {
        console.log(error);
      });
      image = result.secure_url;
    }

    const post = new Post({
      user: userId,
      text,
      image,
    });

    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
