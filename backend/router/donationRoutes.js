// routes/donationRoutes.js
import express from "express";
import { addDonationCenter, getDonationCenters, createDonationRequest, updateDonationRequestStatus, findCompatibleDonors, getTopDonors, getDonationHistory , getAllDonationRequests  } from "../controller/donationController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/center/add", isAdminAuthenticated, addDonationCenter);
router.get("/centers", getDonationCenters);
router.post("/request", isPatientAuthenticated, createDonationRequest);
router.put("/request/:requestId/status", isAdminAuthenticated, updateDonationRequestStatus);
router.get("/compatible-donors", isPatientAuthenticated, findCompatibleDonors);
// router.get("/top-donors", getTopDonors);
// router.get("/history", isPatientAuthenticated, getDonationHistory);
router.get("/donation-requests", isAdminAuthenticated, getAllDonationRequests);
export default router;
