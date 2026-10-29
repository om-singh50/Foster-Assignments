import mongoose from "mongoose";
import Lead from "../models/Lead.js";

// Submit a public enquiry without authentication
export const createLead = async (req, res) => {
  const { fullName, email, phone, courseInterest, message } = req.body;

  if (
    typeof fullName !== "string" ||
    fullName.trim().length < 2 ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof courseInterest !== "string" ||
    courseInterest.trim().length < 2
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, valid email, and course interest are required",
    });
  }

  const lead = await Lead.create({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone,
    courseInterest: courseInterest.trim(),
    message,
    status: "public",
    assignedTo: null,
    claimedAt: null,
  });

  return res.status(201).json({
    success: true,
    message: "Enquiry submitted successfully",
    data: lead,
  });
};

// Fetch all unclaimed public enquiries
export const getPublicLeads = async (req, res) => {
  const leads = await Lead.find({
    status: "public",
    assignedTo: null,
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: leads.length,
    data: leads,
  });
};

// Claim a lead
export const claimLead = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lead ID",
    });
  }

  // Atomic update: only one counselor can claim the lead.
  const lead = await Lead.findOneAndUpdate(
    {
      _id: id,
      status: "public",
      assignedTo: null,
    },
    {
      $set: {
        status: "claimed",
        assignedTo: req.employee._id,
        claimedAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!lead) {
    const exists = await Lead.exists({ _id: id });

    return res.status(exists ? 409 : 404).json({
      success: false,
      message: exists
        ? "Lead has already been claimed"
        : "Lead not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Lead claimed successfully",
    data: lead,
  });
};

// Fetch leads claimed by the logged-in counselor
export const getMyLeads = async (req, res) => {
  const leads = await Lead.find({
    assignedTo: req.employee._id,
    status: "claimed",
  }).sort({ claimedAt: -1 });

  return res.status(200).json({
    success: true,
    count: leads.length,
    data: leads,
  });
};