import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    // mark all notifications for the user as read
    await Notification.updateMany({ to: userId }, { $set: { read: true } });

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).jsonn({ error: "Internal server error" });
  }
};
