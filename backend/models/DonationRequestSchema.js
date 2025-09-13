// models/donationRequestSchema.js
import mongoose from "mongoose";

const donationRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  center: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

export const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);




