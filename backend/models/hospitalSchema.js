// models/hospitalSchema.js
import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  contactNumber: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  type: {
  type: String,
  enum: ["cardiac", "trauma", "neuro", "general"],
  required: true
},
  emergencyBeds: { type: Number, default: 0 },
  availableBeds: { type: Number, default: 0 },
  facilities: {
    otAvailable: { type: Boolean, default: false },
    xrayAvailable: { type: Boolean, default: false },
    ctScanAvailable: { type: Boolean, default: false },
    bloodBankAvailable: { type: Boolean, default: false }
  },
  lastUpdated: { type: Date, default: Date.now }
});

export const Hospital = mongoose.model("Hospital", hospitalSchema);
