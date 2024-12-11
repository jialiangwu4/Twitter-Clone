import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //in ms
    httpOnly: true, // prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
    sameSite: "strict", // prevent CSRF attacks
  });
};
