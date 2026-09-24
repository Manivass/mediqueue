const mongoose = require("mongoose");

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

doctorAvailabilitySchema.index(
  { doctorId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "DoctorAvailability",
  doctorAvailabilitySchema
);