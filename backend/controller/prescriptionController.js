import { Prescription } from "../models/prescriptionSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { Appointment } from "../models/appointmentSchema.js";

// Utility function to validate time format (HH:mm)
const isValidTimeFormat = (time) => {
  const regex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
};

// Utility function to validate date format (ISO 8601)
const isValidISODate = (dateStr) => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

// controllers/prescriptionController.js

export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicineName, dosage, frequency, reminderTimes, startDate, endDate, reminderMedium } = req.body;

    // Validate
    if (!appointmentId || !medicineName || !dosage || !frequency || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    // Get patient & doctor from appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    const { patientId, doctorId } = appointment;

    // Create prescription
    const prescription = await Prescription.create({
      appointmentId,
      patientId,
      doctorId,
      medicineName,
      dosage,
      frequency,
      reminderTimes,
      startDate,
      endDate,
      reminderMedium
    });

    res.status(201).json({
      success: true,
      message: "Prescription created successfully.",
      data: prescription
    });

  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// This controller will be called by n8n every 15 minutes
export const getPrescriptionsToRemind = async (req, res) => {
  try {
    const { time } = req.query; // expected "HH:mm" format

    if (!time) {
      return res.status(400).json({ error: "Missing time parameter in query." });
    }

    const now = new Date();
    console.log("🔍 Checking reminders for time:", time, " at server time:", now.toISOString());

    // Step 1: Get prescriptions matching current time
    const prescriptions = await Prescription.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      reminderTimes: { $elemMatch: { $regex: `^${time.trim()}`, $options: "i" } }
    }).lean(); // lean() for plain JS objects

    console.log("✅ Found prescriptions:", prescriptions.length);

    // Step 2: Get all patient IDs from prescriptions
    const patientIds = prescriptions.map(p => p.patientId);

    // Step 3: Fetch patients from User collection
    const patients = await User.find(
      { _id: { $in: patientIds } },
      { firstName: 1, lastName: 1, email: 1, phone: 1 }
    ).lean();

    // Step 4: Map patients by ID for quick lookup
    const patientMap = {};
    patients.forEach(p => {
      patientMap[p._id] = p;
    });

    // Step 5: Merge patient data with prescriptions
    const result = prescriptions.map(p => {
      const patient = patientMap[p.patientId] || {};
      return {
        patientName: `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Unknown",
        patientEmail: patient.email || "",
        patientPhone: patient.phone || "",
        medicineName: p.medicineName,
        dosage: p.dosage,
        reminderTimes: p.reminderTimes,
        reminderMedium: p.reminderMedium
      };
    });

    res.json(result);
  } catch (error) {
    console.error("❌ Error in getPrescriptionsToRemind:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Optional: verify that appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Fetch prescription linked to the appointment
    const prescription = await Prescription.findOne({ appointmentId });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "No prescription found for this appointment",
      });
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching prescription",
    });
  }
};
export const updatePrescription = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const doctorId = req.user._id; // Logged-in doctor

  // 1. Find prescription
  const prescription = await Prescription.findById(id);
  if (!prescription) {
    return next(new ErrorHandler("Prescription not found", 404));
  }

  // 2. Ensure the logged-in doctor is the one who created it
  if (prescription.doctorId.toString() !== doctorId.toString()) {
    return next(new ErrorHandler("Unauthorized to update this prescription", 403));
  }

  const {
    medicineName,
    dosage,
    frequency,
    reminderTimes,
    startDate,
    endDate,
    reminderMedium,
  } = req.body;

  // 3. Validate reminderTimes if provided
  if (reminderTimes) {
    if (
      !Array.isArray(reminderTimes) ||
      reminderTimes.some((time) => !isValidTimeFormat(time))
    ) {
      return next(new ErrorHandler("Reminder times must be in HH:mm format.", 400));
    }
    prescription.reminderTimes = reminderTimes;
  }

  // 4. Validate dates if provided
  if (startDate) {
    if (!isValidISODate(startDate)) {
      return next(new ErrorHandler("Invalid start date.", 400));
    }
    prescription.startDate = new Date(startDate);
  }

  if (endDate) {
    if (!isValidISODate(endDate)) {
      return next(new ErrorHandler("Invalid end date.", 400));
    }
    prescription.endDate = new Date(endDate);
  }

  if (startDate && endDate) {
    if (new Date(endDate) < new Date(startDate)) {
      return next(new ErrorHandler("End date must be after start date.", 400));
    }
  }

  // 5. Validate reminderMedium if provided
  const validMediums = ["sms", "email", "whatsapp"];
  if (reminderMedium) {
    if (!validMediums.includes(reminderMedium.toLowerCase())) {
      return next(
        new ErrorHandler(
          "Reminder medium must be one of: sms, email, or whatsapp.",
          400
        )
      );
    }
    prescription.reminderMedium = reminderMedium;
  }

  // 6. Update other fields if provided
  if (medicineName) prescription.medicineName = medicineName;
  if (dosage) prescription.dosage = dosage;
  if (frequency) prescription.frequency = frequency;

  // 7. Save
  await prescription.save();

  res.status(200).json({
    success: true,
    message: "Prescription updated successfully",
    prescription,
  });
});