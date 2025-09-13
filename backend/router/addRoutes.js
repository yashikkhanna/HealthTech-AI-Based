// routes/addRoutes.js
import express from "express";
import { addAmbulance , addHospital } from "../controller/addingDataController.js";
import {  isAdminAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

// Add Hospital
router.post("/hospitals/add", isAdminAuthenticated , addHospital);

// Add Ambulance
router.post("/ambulances/add", isAdminAuthenticated , addAmbulance);

export default router;
