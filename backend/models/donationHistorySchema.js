// models/donationHistorySchema.js
import mongoose from "mongoose";

const donationHistorySchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  center: { type: mongoose.Schema.Types.ObjectId, ref: "DonationCenter", required: true },
  request: { type: mongoose.Schema.Types.ObjectId, ref: "DonationRequest" }, // optional link
  
  donatedAt: { type: Date, required: true },
  certificateUrl: String, // Cloudinary URL for certificate
  status: { 
    type: String, 
    enum: ["SUBMITTED", "APPROVED", "REJECTED"], 
    default: "SUBMITTED", 
    index: true 
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin verifying
  notes: String,

  // Gamification
  pointsAwarded: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes for fast queries
donationHistorySchema.index({ status: 1, createdAt: -1 });
donationHistorySchema.index({ donor: 1, donatedAt: -1 });

export const DonationHistory = mongoose.model("DonationHistory", donationHistorySchema);
