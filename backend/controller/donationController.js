import { Donation } from "../models/donationSchema.js";
import { DonationRequest } from "../models/DonationRequestSchema.js";
import { DonationHistory } from "../models/donationHistorySchema.js";
import { User } from "../models/userSchema.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js"
import cloudinary from "cloudinary";

/**
 * 1️⃣ Admin - Add a donation center
 */
export const addDonationCenter = catchAsyncErrors(async (req, res, next) => {
  const { name, city, address, contactNumber } = req.body;

  if (!name || !city || !address || !contactNumber) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Check if a center with same name, city, and address already exists
  const existingCenter = await Donation.findOne({ 
    name: name.trim(), 
    city: city.trim(), 
    address: address.trim() 
  });

  if (existingCenter) {
    return next(new ErrorHandler("A donation center with these details already exists", 400));
  }

  const newCenter = await Donation.create({
    name: name.trim(),
    city: city.trim(),
    address: address.trim(),
    contactNumber: contactNumber.trim()
  });

  res.status(201).json({
    success: true,
    message: "Donation center added successfully",
    center: newCenter
  });
});


/**
 * 2️⃣ Get all donation centers
 */
export const getDonationCenters = catchAsyncErrors(async (req, res, next) => {
  const centers = await Donation.find();
  res.status(200).json({ success: true, centers });
});

/**
 * 3️⃣ User applies as donor
 */
export const createDonationRequest = catchAsyncErrors(async (req, res, next) => {
  const { centerId, bloodGroup } = req.body;

  if (!centerId || !bloodGroup) {
    return next(new ErrorHandler("Center ID and Blood Group are required", 400));
  }

  if (!req.files || !req.files.cbcReport) {
    return next(new ErrorHandler("CBC Report file is required", 400));
  }

  // Check if user already has a pending or approved request
  const existingRequest = await DonationRequest.findOne({
    user: req.user.id,
    center: centerId,
    status: { $in: ["Pending", "Approved"] }
  });

  if (existingRequest) {
    return next(new ErrorHandler("You already have a pending or approved request for this center", 400));
  }

  const cbcFile = req.files.cbcReport;
  const allowedFormats = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(cbcFile.mimetype)) {
    return next(new ErrorHandler("Invalid file format", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(cbcFile.tempFilePath, {
    folder: "cbc_reports"
  });

  // Update patient details
  await User.findByIdAndUpdate(req.user.id, {
    bloodGroup,
    cbcReport: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    },
    cbcStatus: "Pending"
  });

  const donationRequest = await DonationRequest.create({
    user: req.user.id, // taken from logged-in patient
    center: centerId,
    date: new Date(),
    status: "Pending"
  });

  res.status(201).json({
    success: true,
    message: "Donation request submitted successfully. Awaiting admin approval.",
    donationRequest
  });
});

export const getAllDonationRequests = async (req, res) => {
  try {
    const requests = await DonationRequest.find()
      .populate({
        path: "user",
        select:
          "firstName lastName email phone nic dob gender bloodGroup cbcReport cbcStatus role",
      })
      .populate({
        path: "center",
        select: "name city address contactNumber",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching donation requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching donation requests",
    });
  }
};

/**
 * 4️⃣ Admin approves/rejects donor
 */
export const updateDonationRequestStatus = catchAsyncErrors(async (req, res, next) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const donationRequest = await DonationRequest.findById(requestId).populate("user center");
  if (!donationRequest) return next(new ErrorHandler("Donation request not found", 404));

  donationRequest.status = status;
  donationRequest.reviewedBy = req.user.id;
  donationRequest.reviewedAt = new Date();
  await donationRequest.save();

  if (status === "Approved") {
    await User.findByIdAndUpdate(donationRequest.user._id, { cbcStatus: "Approved" });
    await Donation.findByIdAndUpdate(donationRequest.center._id, {
      $addToSet: { donors: donationRequest.user._id }
    });
  } else {
    await User.findByIdAndUpdate(donationRequest.user._id, { cbcStatus: "Rejected" });
  }

  res.status(200).json({
    success: true,
    message: `Donation request ${status.toLowerCase()} successfully`
  });
});

/**
 * 5️⃣ Get donors by blood compatibility
 */
export const findCompatibleDonors = catchAsyncErrors(async (req, res, next) => {
  const { requiredBloodGroup } = req.query;
  if (!requiredBloodGroup) return next(new ErrorHandler("Blood group is required", 400));

  const compatibility = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    "AB-": ["A-", "B-", "AB-", "O-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"]
  };

  const compatibleGroups = compatibility[requiredBloodGroup];
  if (!compatibleGroups) return next(new ErrorHandler("Invalid blood group", 400));

  const donors = await User.find({
    bloodGroup: { $in: compatibleGroups },
    cbcStatus: "Approved"
  });

  res.status(200).json({ success: true, donors });
});

/**
 * 6️⃣ Get top donors leaderboard
 */
export const getTopDonors = catchAsyncErrors(async (req, res, next) => {
  const topDonors = await User.find({ cbcStatus: "Approved" })
    .sort({ totalDonations: -1 })
    .limit(10)
    .select("firstName lastName totalDonations");

  res.status(200).json({ success: true, topDonors });
});

/**
 * 7️⃣ Get donation history for a user
 */
export const getDonationHistory = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("donations.center");
  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({ success: true, donations: user.donations });
});

// 📌 1. Receiver requests blood
export const requestBlood = catchAsyncErrors(async (req, res, next) => {
  const { bloodGroup, centerId, neededBy } = req.body;

  const request = await DonationRequest.create({
    requester: req.user._id,
    bloodGroup,
    center: centerId,
    neededBy,
    status: "PENDING"
  });

  res.status(201).json({
    success: true,
    message: "Blood request created successfully",
    request
  });
});