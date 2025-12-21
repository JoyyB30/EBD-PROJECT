const mongoose = require("mongoose");

const loanRequestSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestedAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    approvedAmount: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    dateRequested: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoanRequest", loanRequestSchema);