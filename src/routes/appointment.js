const express = require("express");
const userAuth = require("../middleware/userAuth");
const User = require("../models/user");
const Appointment = require("../models/appointment");

const appointment = express.Router();

appointment.post("/appointment/:id", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const { appointmentDate, appointmentTime, bookingType } = req.body;

    const { id } = req.params;

    // Check doctor
    const doctor = await User.findOne({
      _id: id,
      role: "DOCTOR",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "No doctor found",
      });
    }

    // Combine date + time
    const appointmentDateTime = new Date(
      `${appointmentDate}T${appointmentTime}`,
    );

    // Check future
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment date and time must be in the future",
      });
    }

    // Create appointment
    const newAppointment = new Appointment({
      patientId: loggedUser._id,
      doctorId: doctor._id,
      bookingType,
      appointmentDate,
      appointmentTime,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment successfully booked",
      appointment: newAppointment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = appointment;
