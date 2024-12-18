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
