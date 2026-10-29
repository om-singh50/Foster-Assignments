import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerEmployee,
  loginEmployee,
  getCurrentEmployee,
} from "../controllers/authController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

router.post("/register", authLimiter, registerEmployee);

router.post("/login", authLimiter, loginEmployee);

router.get("/me", authMiddleware, getCurrentEmployee);

export default router;