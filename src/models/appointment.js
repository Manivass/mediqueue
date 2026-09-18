const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
      validate: function (value) {
        if (Date.now() > value) {
          throw new Error("date is in past");
        }
      },
    },

    appointmentTime: {
      type: String,
      required: true,
      validate: function (value) {
        if (Date.now() > value) {
          throw new Error("date is in past");
        }
      },
    },

    bookingType: {
      type: String,
      enum: ["ONLINE", "WALK_IN"],
      default: "ONLINE",
    },

    status: {
      type: String,
      enum: ["BOOKED", "WAITING", "IN_CONSULTATION", "COMPLETED", "CANCELLED"],
      default: "BOOKED",
    },

    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
