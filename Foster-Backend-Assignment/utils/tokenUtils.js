import jwt from "jsonwebtoken";

export const generateAccessToken = (employee) => {
  return jwt.sign(
    {
      tokenType: "access",
    },
    process.env.JWT_ACCESS_SECRET,
    {
      subject: employee._id.toString(),
      expiresIn: process.env.ACCESS_TOKEN_TTL || "15m",
      algorithm: "HS256",
    }
  );
};