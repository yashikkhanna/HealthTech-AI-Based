
import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
  // Patient (logged-in scenario)
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },


  patientName: { type: String },  
  patientPhone: { type: String }, 
  bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },

  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 

  reason: { type: String, required: true },

  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },

  ambulanceRequired: { type: Boolean, default: false },
  status: { type: String, enum: ["Open", "Resolved"], default: "Open" },
  
  createdAt: { type: Date, default: Date.now }
});

export const Emergency = mongoose.model("Emergency", emergencySchema);
