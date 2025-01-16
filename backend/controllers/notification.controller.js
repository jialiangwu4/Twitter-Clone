import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    // get all notifications for the current logged in user
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    // mark all notifications for the user as read
    await Notification.updateMany({ to: userId }, { isRead: true });

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    // delete all notifications for the current logged in user
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });

    return res
      .status(200)
      .json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // check if the logged in user is authorized to delete the notification
    if (notification.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this notification" });
    }

    await Notification.findByIdAndDelete(notificationId);

    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
