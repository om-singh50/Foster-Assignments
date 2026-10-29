import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxlength: 254,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: null,
    },

    courseInterest: {
      type: String,
      required: [true, "Course interest is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    status: {
      type: String,
      enum: ["public", "claimed"],
      default: "public",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    claimedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

leadSchema.index({
  status: 1,
  createdAt: -1,
});

leadSchema.index({
  assignedTo: 1,
  status: 1,
  createdAt: -1,
});

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;