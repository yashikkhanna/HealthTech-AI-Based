import express from "express";
import { createPrescription , getPrescriptionsToRemind , getPrescriptionByAppointment,updatePrescription} from "../controller/prescriptionController.js";
import { isDoctorAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-Prescription", isPatientAuthenticated, createPrescription);
router.get("/reminders", getPrescriptionsToRemind);
router.get("/prescriptions/:appointmentId", isPatientAuthenticated, getPrescriptionByAppointment);
router.put("/updatePrescriptions/:id", isPatientAuthenticated, updatePrescription);

export default router;