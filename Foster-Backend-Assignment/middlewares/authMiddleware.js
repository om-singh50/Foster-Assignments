import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required",
    });
  }

  const token = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET,
      { algorithms: ["HS256"] }
    );
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  if (
    typeof decoded === "string" ||
    decoded.tokenType !== "access" ||
    !decoded.sub
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }

  const employee = await Employee.findById(decoded.sub);

  if (!employee || employee.status !== "active") {
    return res.status(401).json({
      success: false,
      message: "Invalid or inactive employee account",
    });
  }

  req.employee = employee;

  next();
};

export default authMiddleware;