// models/Prescription.js
import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.ObjectId,
    ref: "Appointment",
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String, // e.g., "1 tablet"
    required: true,
  },
  frequency: {
    type: Number, // e.g., 3 means 3 times a day
    required: true,
  },
  reminderTimes: [String], // e.g., ["09:00", "14:00", "20:00"]
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reminderMedium: {
    type: String,
    enum: ["sms", "email", "whatsapp"],
    default: "sms",
  },
  isActive: {
    type: Boolean,
    default: true,
  }
  
});

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
