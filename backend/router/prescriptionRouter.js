import express from "express";
import { createPrescription , getPrescriptionsByPatient, getPrescriptionsToRemind ,updatePrescription} from "../controller/prescriptionController.js";
import { isDoctorAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-Prescription", isPatientAuthenticated, createPrescription);
router.get("/reminders", getPrescriptionsToRemind);
router.get("/prescriptions/:patientId", isPatientAuthenticated,getPrescriptionsByPatient );
router.put("/updatePrescriptions/:id", isPatientAuthenticated, updatePrescription);

export default router;
