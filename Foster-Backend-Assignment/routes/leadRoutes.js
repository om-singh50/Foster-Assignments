import express from "express";

import {
  createLead,
  getPublicLeads,
  claimLead,
  getMyLeads,
} from "../controllers/leadController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public form: authentication is not required.
router.post("/", createLead);

// All remaining endpoints require employee authentication.
router.get("/public", authMiddleware, getPublicLeads);

router.post("/:id/claim", authMiddleware, claimLead);

router.get("/mine", authMiddleware, getMyLeads);

export default router;