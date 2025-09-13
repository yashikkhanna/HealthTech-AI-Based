import express from "express";
import { addNewAdmin,patientRegister , login, getAllDoctors,  getUserDetails, logoutAdmin, logoutPatient, addNewDoctor,logoutDoctor } from "../controller/userController.js";
import { isAdminAuthenticated , isPatientAuthenticated , isDoctorAuthenticated } from "../middlewares/auth.js";
const router=express.Router();

router.post("/patient/register", patientRegister);
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);
router.get("/doctors",getAllDoctors);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/patient/me",isPatientAuthenticated,getUserDetails);
router.get("/doctor/me",isDoctorAuthenticated,getUserDetails);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);
router.get("/doctor/logout",isDoctorAuthenticated,logoutDoctor);
router.get("/patient/logout",isPatientAuthenticated,logoutPatient);
router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor);

export default router; 