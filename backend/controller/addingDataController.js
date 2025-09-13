// controllers/hospitalController.js
import { Hospital } from "../models/hospitalSchema.js";
import { Ambulance } from "../models/ambulanceSchema.js";

export const addHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ success: true, hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAmbulance = async (req, res) => {
  try {
    const  {hospital}  = req.body;

    // Validate hospital exists
    const hospitalId = await Hospital.findById(hospital);
    if (!hospitalId) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    const ambulance = await Ambulance.create(req.body);
    res.status(201).json({ success: true, ambulance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};