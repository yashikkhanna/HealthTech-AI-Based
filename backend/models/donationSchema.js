import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: String,
  address: String,
  contactNumber: String,
  totalDonations: { type: Number, default: 0 },
  donors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // list of donor IDs
});

export const Donation= mongoose.model("Donation",donationSchema);