import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// this middleware function ensures that only authenticated users with a valid JWT token can access protected routes.
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Get the token from the cookie
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    const user = await User.findById(decoded.id).select("-password"); // Get the user from the database
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // Attach the user object to the request
    next(); // Call the next middleware
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
