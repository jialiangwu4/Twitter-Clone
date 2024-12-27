import { v2 as cloudinary } from "cloudinary";

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

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // only the user who created the post can delete it
    if (post.user.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    // if the post has an image, also delete it from cloudinary
    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }

    // delete it from the database
    await Post.findByIdAndDelete(id);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
