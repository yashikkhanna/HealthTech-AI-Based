// models/User.js
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const giftCardSchema = new mongoose.Schema({
  code: String,
  issuedAt: { type: Date, default: Date.now },
  redeemed: { type: Boolean, default: false },
});
const userSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [3, "First name must be at least 3 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minLength: [3, "Last name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minLength: [10, "Phone number must be exactly 10 digits"],
      maxLength: [10, "Phone number must be exactly 10 digits"],
    },
    nic: {
      type: String,
      required: [true, "NIC is required"],
      minLength: [13, "NIC must be exactly 13 characters"],
      maxLength: [13, "NIC must be exactly 13 characters"],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female"],
    },
    password: {
      type: String,
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Patient", "Doctor"],
    },

    // Doctor-specific Fields
    doctorDepartment: String,
    qualifications: [String],
    experienceYears: Number,
    clinicAddress: String,
    consultationFee: Number,
    availability: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],

    // Account Control
    status: {
      type: String,
      enum: ["Active", "Inactive", "Banned"],
      default: "Active",
    },
    emailVerified: { type: Boolean, default: false },
    verificationToken: String,
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,

    // Avatar (Doctor)
    docAvatar: {
      public_id: String,
      url: String,
    },

    // CBC Report
    cbcReport: {
      public_id: String, // Cloudinary file ID
      url: String, // Cloudinary file URL
    },
    cbcStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // Blood Info
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    totalDonations: { type: Number, default: 0, index: true },
  badges: [{ type: String }],               // e.g. ["FIRST_DROP","FIVE_LIFESAVER","TEN_HERO",...]
  giftCards: [giftCardSchema],              // issued gift cards
}, { timestamps: true });
  
// Password Hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT Token Generator
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
