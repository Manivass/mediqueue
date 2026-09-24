const express = require("express");
const userAuth = require("../middleware/userAuth");
const DoctorAvailability = require("../models/doctorAvailability");

const doctor = express.Router();

doctor.post("/doctor/availability", userAuth, async (req, res) => {
  try {
    // 1. Check logged-in user is doctor
    if (req.user.role !== "DOCTOR") {
      return res.status(403).json({
        success: false,
        message: "Only doctors can add availability",
      });
    }

    const { availability } = req.body;

    // 2. Check input
    if (!Array.isArray(availability) || availability.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Availability is required",
      });
    }

    const doctorId = req.user._id;

    const availabilityData = [];

    for (const slot of availability) {
      const { date, startTime, endTime } = slot;

      // 3. Required fields
      if (!date || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: "Date, startTime and endTime are required",
        });
      }

      // 4. Validate date
      const selectedDate = new Date(date);

      if (isNaN(selectedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date",
        });
      }

      // 5. Date should be in future
      if (selectedDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Availability date must be in the future",
        });
      }

      // 6. Convert time to minutes
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;

      // 7. Check time
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: "Start time must be before end time",
        });
      }

      availabilityData.push({
        doctorId,
        date: selectedDate,
        startTime,
        endTime,
        isAvailable: true,
      });
    }

    // 8. Check duplicate dates
    const dates = availabilityData.map(
      (item) => item.date.toISOString().split("T")[0],
    );

    const uniqueDates = new Set(dates);

    if (dates.length !== uniqueDates.size) {
      return res.status(400).json({
        success: false,
        message: "Multiple availability entries for same date are not allowed",
      });
    }

    // 9. Save
    const result = await DoctorAvailability.insertMany(availabilityData);

    return res.status(201).json({
      success: true,
      message: "Doctor availability added successfully",
      availability: result,
    });
  } catch (err) {
    // Duplicate availability
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Availability already exists for this date",
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

doctorRouter.get("/doctor/:doctorId/availability",userAuth,async (req, res) => {
    try {
      const { doctorId } = req.params;

      // 1. Check doctor exists
      const doctor = await User.findOne({
        _id: doctorId,
        role: "DOCTOR",
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }

      // 2. Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 3. Find future availability
      const availability = await DoctorAvailability.find({
        doctorId,
        date: { $gte: today },
        isAvailable: true,
      }).sort({ date: 1, startTime: 1 });

      return res.status(200).json({
        success: true,
        doctor: {
          id: doctor._id,
          name: doctor.name,
        },
        availability,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);



module.exports = doctor;
