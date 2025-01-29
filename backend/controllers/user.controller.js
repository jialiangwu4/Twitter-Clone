import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params; // Get the username from the request parameters

  try {
    const user = await User.findOne({ username: username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params; // user to be followed or unfollowed
  const { _id } = req.user; // me

  try {
    const user = await User.findById(id); // Get the user to be followed or unfollowed
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const me = await User.findById(_id); // Get the user who is making the request
    if (!me) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is trying to follow/unfollow themselves
    if (id === _id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });
    }

    // Check if me is already following the other user
    const isFollowing = me.following.includes(id);
    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(
        _id,
        { $pull: { following: id } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        id,
        { $pull: { followers: _id } },
        { new: true }
      );
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(
        _id,
        { $push: { following: id } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        id,
        { $push: { followers: _id } },
        { new: true }
      );

      // Send a notification to the other user
      const newNotification = new Notification({
        type: "follow",
        from: _id, // me
        to: id, // user to be followed
      });

      await newNotification.save();

      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const myId = req.user._id; // Get the current user's ID

    // Find users who are not me and not following by me
    const suggestedUsers = await User.find({
      _id: { $ne: myId },
      followers: { $ne: myId },
    })
      .select("-password")
      .limit(5);

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  // modify user profile fields
  const {
    username,
    fullName,
    email,
    currentPassword,
    newPassword,
    confirmNewPassword,
    bio,
    link,
  } = req.body;
  const userId = req.user._id;
  let { profileImg, coverImg } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // if missing any of the password fields, return an error
    if (
      (!currentPassword && (newPassword || confirmNewPassword)) ||
      (currentPassword && (!newPassword || !confirmNewPassword))
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    // if all password fields are provided, check if the current password is correct and update the password
    if (currentPassword && newPassword && confirmNewPassword) {
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // check if new password and confirm new password match, confirm no typos
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: "New passwords do not match" });
      }

      if (newPassword.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    if (profileImg) {
      if (user.profileImg && user.profileImg !== profileImg) {
        // Delete the old profile image from Cloudinary if it exists
        // example url: https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg
        // here we are extracting the 'shoes' from above url
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      // Upload the profile image to Cloudinary
      const uploadResult = await cloudinary.uploader
        .upload(profileImg)
        .catch((error) => {
          console.log(error);
        });

      profileImg = uploadResult.secure_url;
    }

    if (coverImg) {
      if (user.coverImg && user.coverImg !== coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadResult = await cloudinary.uploader
        .upload(coverImg)
        .catch((error) => {
          console.log(error);
        });

      coverImg = uploadResult.secure_url;
    }

    if (username && username !== user.username) {
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
      if (!emailRegex.test(email)) {
        // Check if email is valid
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      user.email = email;
    }

    // Update the rest of the fields if a new value is provided, otherwise keep the current value
    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      link: user.link,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
