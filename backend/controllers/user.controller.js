import User from "../models/user.model.js";

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

      // TODO: send notification
      //

      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
