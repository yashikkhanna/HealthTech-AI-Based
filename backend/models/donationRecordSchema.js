import mongoose from "mongoose";

const donationRecordSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional, if known
  center: { type: mongoose.Schema.Types.ObjectId, ref: "DonationCenter", required: true },
  date: { type: Date, required: true },
  certificateUrl: { type: String }, // proof of donation
  verified: { type: Boolean, default: false }, // admin verifies this
}, { timestamps: true });

export const DonationRecord = mongoose.model("DonationRecord", donationRecordSchema);