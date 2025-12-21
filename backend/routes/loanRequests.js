const express = require("express");
const LoanRequest = require("../models/loanRequests");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { farmerId, requestedAmount } = req.body;

    if (!farmerId) {
      return res.status(400).json({ message: "farmerId is required" });
    }

    const amount = Number(requestedAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ message: "requestedAmount must be a positive number" });
    }

    const loan = new LoanRequest({
      farmerId,
      requestedAmount: amount,
    });

    await loan.save();

    return res.status(201).json(loan);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const loans = await LoanRequest.find()
      .populate("farmerId", "username phone nationalID")
      .sort({ dateRequested: -1 });

    return res.json(loans);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const loans = await LoanRequest.find({
      farmerId: req.params.farmerId,
    }).sort({ dateRequested: -1 });

    return res.json(loans);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status, approvedAmount } = req.body;

    const update = {};

    if (status) {
      update.status = status;
    }

    if (approvedAmount !== undefined) {
      const a = Number(approvedAmount);
      if (Number.isNaN(a) || a <= 0) {
        return res
          .status(400)
          .json({ message: "approvedAmount must be a positive number" });
      }
      update.approvedAmount = a;
    }

    const loan = await LoanRequest.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate("farmerId", "username phone nationalID");

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    return res.json(loan);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const loan = await LoanRequest.findByIdAndDelete(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    return res.json({ message: "Loan deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;