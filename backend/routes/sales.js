const express = require("express");
const Sale = require("../models/sales");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { farmerId, productType, quantity, unitPrice } = req.body;

    if (!farmerId) {
      return res.status(400).json({ message: "farmerId is required" });
    }

    if (!productType) {
      return res.status(400).json({ message: "productType is required" });
    }

    const q = Number(quantity);
    const u = Number(unitPrice);

    if (Number.isNaN(q) || Number.isNaN(u)) {
      return res
        .status(400)
        .json({ message: "quantity and unitPrice must be numbers" });
    }

    const totalAmount = q * u;

    const sale = new Sale({
      farmerId,
      productType,
      quantity: q,
      unitPrice: u,
      totalAmount,
    });

    await sale.save();

    return res.status(201).json(sale);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    return res.json(sales);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const sales = await Sale.find({
      farmerId: req.params.farmerId,
    }).sort({ date: -1 });

    return res.json(sales);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { productType, quantity, unitPrice } = req.body;

    const update = {};

    if (productType !== undefined) {
      update.productType = productType;
    }

    if (quantity !== undefined) {
      update.quantity = Number(quantity);
    }

    if (unitPrice !== undefined) {
      update.unitPrice = Number(unitPrice);
    }

    if (quantity !== undefined && unitPrice !== undefined) {
      update.totalAmount = Number(quantity) * Number(unitPrice);
    }

    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    return res.json(updatedSale);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);

    if (!deletedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    return res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;