const express = require("express");
const mongoose = require("mongoose");
const Purchase = require("../models/purchases");
const Sale = require("../models/sales");

const router = express.Router();

router.get("/monthly/:farmerId", async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ message: "Invalid farmerId" });
    }

    const farmerObjectId = new mongoose.Types.ObjectId(farmerId);

    const purchases = await Purchase.aggregate([
      { $match: { farmerId: farmerObjectId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalExpense: { $sum: "$totalCost" },
        },
      },
    ]);

    const sales = await Sale.aggregate([
      { $match: { farmerId: farmerObjectId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalIncome: { $sum: "$totalAmount" },
        },
      },
    ]);

    const result = {};

    purchases.forEach((p) => {
      const key = `${p._id.year}-${p._id.month}`;
      result[key] = { expense: p.totalExpense, income: 0 };
    });

    sales.forEach((s) => {
      const key = `${s._id.year}-${s._id.month}`;
      if (!result[key]) {
        result[key] = { expense: 0 };
      }
      result[key].income = s.totalIncome;
    });

    res.json(result);
  } catch (err) {
    console.error("GET /api/summary/monthly error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;