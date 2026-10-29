import bcrypt from "bcryptjs";
import { z } from "zod";

import Employee from "../models/Employee.js";
import { generateAccessToken } from "../utils/tokenUtils.js";


const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Password must not exceed 72 UTF-8 bytes"
  );

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: passwordSchema,
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: passwordSchema,
});

const validationErrors = (error) =>
  error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

export const registerEmployee = async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors(result.error),
    });
  }

  const { fullName, password } = result.data;
  const email = result.data.email.toLowerCase();

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const employee = await Employee.create({
      fullName,
      email,
      passwordHash,
      role: "counselor",
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Registration submitted. Approval is required before login.",
      data: {
        employee: {
          id: employee._id,
          fullName: employee.fullName,
          email: employee.email,
          role: employee.role,
          status: employee.status,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    throw error;
  }
};

export const loginEmployee = async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors(result.error),
    });
  }

  const { password } = result.data;
  const email = result.data.email.toLowerCase();

  const employee = await Employee.findOne({ email })
    .select("+passwordHash");

  if (!employee) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const passwordMatches = await bcrypt.compare(
    password,
    employee.passwordHash
  );

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (employee.status === "pending") {
    return res.status(403).json({
      success: false,
      message: "Your account is awaiting approval",
    });
  }

  if (employee.status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Your account is disabled",
    });
  }

  employee.lastLoginAt = new Date();
  await employee.save();

  const accessToken = generateAccessToken(employee);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      tokenType: "Bearer",
      expiresIn: process.env.ACCESS_TOKEN_TTL || "15m",
      employee: {
        id: employee._id,
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role,
      },
    },
  });
};

export const getCurrentEmployee = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      employee: {
        id: req.employee._id,
        fullName: req.employee.fullName,
        email: req.employee.email,
        role: req.employee.role,
        status: req.employee.status,
      },
    },
  });
};