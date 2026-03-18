import { Prescription } from "../models/prescriptionSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";

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

// ----------------------------------------
// Create Prescription (patient-centric)
// ----------------------------------------
export const createPrescription = catchAsyncErrors(async (req, res, next) => {
  const patientId = req.user._id; // logged-in patient
  const {
    medicineName,
    dosage,
    frequency,
    reminderTimes,
    startDate,
    endDate,
    reminderMedium,
  } = req.body;

  // Validation
  if (!medicineName || !dosage || !frequency || !startDate || !endDate) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  if (reminderTimes) {
    if (
      !Array.isArray(reminderTimes) ||
      reminderTimes.some((time) => !isValidTimeFormat(time))
    ) {
      return next(new ErrorHandler("Reminder times must be in HH:mm format.", 400));
    }
  }

  if (!isValidISODate(startDate)) {
    return next(new ErrorHandler("Invalid start date.", 400));
  }

  if (!isValidISODate(endDate)) {
    return next(new ErrorHandler("Invalid end date.", 400));
  }

  if (new Date(endDate) < new Date(startDate)) {
    return next(new ErrorHandler("End date must be after start date.", 400));
  }

  const validMediums = ["sms", "email", "whatsapp"];
  if (reminderMedium && !validMediums.includes(reminderMedium.toLowerCase())) {
    return next(
      new ErrorHandler("Reminder medium must be one of: sms, email, whatsapp.", 400)
    );
  }

  const prescription = await Prescription.create({
    patientId,
    medicineName,
    dosage,
    frequency,
    reminderTimes,
    startDate,
    endDate,
    reminderMedium,
  });

  res.status(201).json({
    success: true,
    message: "Prescription created successfully.",
    data: prescription,
  });
});

// ----------------------------------------
// Get prescriptions that need reminders
// Called by n8n every 15 minutes
// ----------------------------------------
export const getPrescriptionsToRemind = catchAsyncErrors(async (req, res, next) => {
  const { time } = req.query; // expected "HH:mm"

  if (!time || !isValidTimeFormat(time)) {
    return next(new ErrorHandler("Missing or invalid time parameter (HH:mm).", 400));
  }

  const now = new Date();
  console.log("🔍 Checking reminders for:", time, " | Server time:", now.toISOString());

  const prescriptions = await Prescription.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    reminderTimes: { $elemMatch: { $regex: `^${time.trim()}`, $options: "i" } },
  }).lean();

  console.log("✅ Found prescriptions:", prescriptions.length);

  const patientIds = prescriptions.map((p) => p.patientId);

  const patients = await User.find(
    { _id: { $in: patientIds } },
    { firstName: 1, lastName: 1, email: 1, phone: 1 }
  ).lean();

  const patientMap = {};
  patients.forEach((p) => {
    patientMap[p._id] = p;
  });

  const result = prescriptions.map((p) => {
    const patient = patientMap[p.patientId] || {};
    return {
      patientName: `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Unknown",
      patientEmail: patient.email || "",
      patientPhone: patient.phone || "",
      medicineName: p.medicineName,
      dosage: p.dosage,
      reminderTimes: p.reminderTimes,
      reminderMedium: p.reminderMedium,
    };
  });

  res.json(result);
});

// ----------------------------------------
// Get prescriptions for logged-in patient
// ----------------------------------------
export const getPrescriptionsByPatient = catchAsyncErrors(async (req, res, next) => {
  const patientId = req.user._id;
  const prescriptions = await Prescription.find({ patientId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: prescriptions,
  });
});

// ----------------------------------------
// Update prescription (patient only)
// ----------------------------------------
export const updatePrescription = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const patientId = req.user._id;

  const prescription = await Prescription.findById(id);
  if (!prescription) {
    return next(new ErrorHandler("Prescription not found", 404));
  }

  if (prescription.patientId.toString() !== patientId.toString()) {
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

  // Reminder times validation
  if (reminderTimes) {
    if (
      !Array.isArray(reminderTimes) ||
      reminderTimes.some((time) => !isValidTimeFormat(time))
    ) {
      return next(new ErrorHandler("Reminder times must be in HH:mm format.", 400));
    }
    prescription.reminderTimes = reminderTimes;
  }

  // Date validation
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

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return next(new ErrorHandler("End date must be after start date.", 400));
  }

  // Reminder medium validation
  const validMediums = ["sms", "email", "whatsapp"];
  if (reminderMedium) {
    if (!validMediums.includes(reminderMedium.toLowerCase())) {
      return next(
        new ErrorHandler("Reminder medium must be one of: sms, email, whatsapp.", 400)
      );
    }
    prescription.reminderMedium = reminderMedium;
  }

  // Other fields
  if (medicineName) prescription.medicineName = medicineName;
  if (dosage) prescription.dosage = dosage;
  if (frequency) prescription.frequency = frequency;

  await prescription.save();

  res.status(200).json({
    success: true,
    message: "Prescription updated successfully",
    prescription,
  });
});
