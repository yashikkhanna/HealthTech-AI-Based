// models/ambulanceSchema.js
import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  driverName: String,
  driverPhone: String,
  vehicleNumber: String,
  type: { type: String, enum: ["Basic", "Advanced", "ICU"], default: "Basic" },
  location: {
    latitude: Number,
    longitude: Number
  },
  status: { type: String, enum: ["Available", "OnDuty", "Maintenance"], default: "Available" },
  lastUpdated: { type: Date, default: Date.now }
});

export const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
