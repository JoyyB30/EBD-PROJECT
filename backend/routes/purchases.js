const express = require("express");
const Purchase = require("../models/purchases");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { farmerId, supplierId, itemType, quantity, unitPrice } = req.body;

    if (!farmerId) {
      return res.status(400).json({ message: "farmerId is required" });
    }

    if (!itemType) {
      return res.status(400).json({ message: "itemType is required" });
    }

    const q = Number(quantity);
    const u = Number(unitPrice);

    if (Number.isNaN(q) || Number.isNaN(u)) {
      return res
        .status(400)
        .json({ message: "quantity and unitPrice must be numbers" });
    }

    const totalCost = q * u;

    const purchase = new Purchase({
      farmerId,
      supplierId,
      itemType,
      quantity: q,
      unitPrice: u,
      totalCost,
    });

    await purchase.save();

    return res.status(201).json(purchase);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ date: -1 });
    return res.json(purchases);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const purchases = await Purchase.find({
      farmerId: req.params.farmerId,
    }).sort({ date: -1 });

    return res.json(purchases);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { supplierId, itemType, quantity, unitPrice } = req.body;

    const update = {};

    if (supplierId !== undefined) {
      update.supplierId = supplierId;
    }

    if (itemType !== undefined) {
      update.itemType = itemType;
    }

    if (quantity !== undefined) {
      update.quantity = Number(quantity);
    }

    if (unitPrice !== undefined) {
      update.unitPrice = Number(unitPrice);
    }

    if (quantity !== undefined && unitPrice !== undefined) {
      update.totalCost = Number(quantity) * Number(unitPrice);
    }

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    return res.json(updatedPurchase);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    return res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;