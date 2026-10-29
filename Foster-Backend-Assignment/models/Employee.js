import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },

    status: {
      type: String,
      enum: ["pending", "active", "disabled"],
      default: "active",
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

employeeSchema.set("toJSON", {
  transform: (_document, result) => {
    delete result.passwordHash;
    return result;
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;