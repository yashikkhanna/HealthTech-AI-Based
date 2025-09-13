// models/MedicineIntake.js
import mongoose from "mongoose";

const medicineIntakeSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User schema
      required: true
    },
    medicineName: {
      type: String,
      required: [true, "Medicine name is required"]
    },
    scheduledTime: {
      type: Date,
      required: [true, "Scheduled time is required"]
    },
    status: {
      type: String,
      enum: ["Pending", "Taken"],
      default: "Pending"
    },
    confirmedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export const MedicineIntake = mongoose.model("MedicineIntake", medicineIntakeSchema);
