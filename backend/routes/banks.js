const express = require("express");
const User = require("../models/users");
const LoanRequest = require("../models/loanRequests");

const router = express.Router();

router.get("/farmers", async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" }).select("-password");
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/loans", async (req, res) => {
  try {
    const loans = await LoanRequest.find()
      .populate("farmerId", "username phone nationalID")
      .sort({ dateRequested: -1 });

    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/loans/farmer/:farmerId", async (req, res) => {
  try {
    const { status, approvedAmount } = req.body;

    const loan = await LoanRequest.findOneAndUpdate(
      { farmerId: req.params.farmerId },
      { status, approvedAmount },
      { new: true }
    ).populate("farmerId", "username phone nationalID");

    if (!loan) {
      return res.status(404).json({ message: "Loan request not found" });
    }

    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;