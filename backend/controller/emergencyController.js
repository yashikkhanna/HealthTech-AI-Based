// controllers/emergencyController.js
import { Emergency } from "../models/emergencySchema.js";
import { User } from "../models/User.js";
import axios from "axios";

export const triggerEmergency = async (req, res) => {
  try {
    const { 
      patientId, 
      reportedById, 
      patientName, 
      patientPhone, 
      bloodGroup, 
      reason, 
      location,
      ambulanceRequired,
      command
    } = req.body;

    let finalReason = reason;
    if (command && ["help me", "emergency", "need help"].includes(command.toLowerCase())) {
      finalReason = "Voice Triggered Emergency";
    }

    let emergencyData = {
      reason: finalReason || "Unspecified emergency",
      location,
      ambulanceRequired
    };

    if (patientId) {
      // Logged-in case
      const patient = await User.findById(patientId);
      emergencyData.patient = patient._id;
      emergencyData.patientName = `${patient.firstName} ${patient.lastName}`;
      emergencyData.patientPhone = patient.phone;
      emergencyData.bloodGroup = patient.bloodGroup;
    } else {
      // Anonymous / voice case
      emergencyData.patientName = patientName;
      emergencyData.patientPhone = patientPhone;
      emergencyData.bloodGroup = bloodGroup;
    }

    if (reportedById) {
      emergencyData.reportedBy = reportedById;
    }

 
    const emergency = await Emergency.create(emergencyData);

    await axios.post(process.env.N8N_EMERGENCY_WEBHOOK, emergencyData);

    res.status(201).json({ success: true, message: "Emergency triggered", emergency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
