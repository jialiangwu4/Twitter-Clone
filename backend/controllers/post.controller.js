import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

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

export const commentPost = async (req, res) => {
  try {
    // add image later
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!text) {
      return res.status(400).json({ error: "Please provide text" });
    }

    // TODO: add image

    // create the comment
    const comment = {
      user: userId,
      text,
    };

    // append the comment
    post.comments.push(comment);
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // check if the user has already liked the post
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // unlike the post
      await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: id } });

      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // like the post
      await Post.updateOne({ _id: id }, { $push: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPosts: id } });

      // create a notification send to the post owner
      const newNotification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
        post: id,
      });

      await newNotification.save();

      return res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// NEED TO LOOK BACK ON THIS
export const getAllPosts = async (req, res) => {
  try {
    // get all posts
    // this is not the best way to get all posts
    // we should use pagination
    // but for now, we will just get all posts
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -email",
      })
      .populate({
        path: "comments.user",
        select: "-password -email",
      });

    if (!posts) {
      return res.status(200).json([]);
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // select the posts that the user has liked
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password -email",
      })
      .populate({
        path: "comments.user",
        select: "-password -email",
      });

    return res.status(200).json(likedPosts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
