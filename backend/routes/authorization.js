const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const router = express.Router();

/**
 * FARMER REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { username, phone, password, nationalID } = req.body;

    if (!/^\d{11}$/.test(String(phone || ""))) {
      return res
        .status(400)
        .json({ message: "Phone number must be exactly 11 digits." });
    }

    if (!/^\d{14}$/.test(String(nationalID || ""))) {
      return res
        .status(400)
        .json({ message: "National ID must be exactly 14 digits." });
    }

    const exists = await User.findOne({
      $or: [{ phone: String(phone) }, { nationalID: String(nationalID) }],
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Phone number or National ID is already used." });
    }

    const user = new User({
      username,
      phone: String(phone),
      password,
      nationalID: String(nationalID),
      role: "farmer",
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role || "farmer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

  return res.status(201).json({
    message: "Farmer registered",
    userId: user._id,
    token,
  });

  } catch (err) {
    if (err?.code === 11000) {
      return res
        .status(400)
        .json({ message: "Phone number or National ID is already used." });
    }

    return res.status(500).json({ message: err.message });
  }
});

/**
 * FARMER LOGIN (username + password)
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ message: "Farmer not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role || "farmer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * STAFF LOGIN (bank/admin via PIN)
 * No DB users needed for bank/admin.
 * Body: { role: "bank" | "admin", pin: "1234" }
 */
router.post("/staff-login", async (req, res) => {
  try {
    const { role, pin } = req.body;

    if (role !== "bank" && role !== "admin") {
      return res.status(400).json({ message: "Invalid role." });
    }

    const expectedPin =
      role === "bank" ? process.env.BANK_PIN : process.env.ADMIN_PIN;

    if (!expectedPin) {
      return res
        .status(500)
        .json({ message: "Missing staff PIN in server env." });
    }

    if (String(pin) !== String(expectedPin)) {
      return res.status(401).json({ message: "Incorrect PIN." });
    }

    const token = jwt.sign(
      { role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: `${role} login successful`, token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/staff-login", async (req, res) => {
  try {
    const { role, pin } = req.body;

    if (role !== "bank" && role !== "admin") {
      return res.status(400).json({ message: "Invalid role." });
    }

    const expectedPin =
      role === "bank" ? process.env.BANK_PIN : process.env.ADMIN_PIN;

    if (!expectedPin) {
      return res
        .status(500)
        .json({ message: "Missing staff PIN in server env." });
    }

    if (String(pin) !== String(expectedPin)) {
      return res.status(401).json({ message: "Incorrect PIN." });
    }

    const token = jwt.sign(
      { role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: `${role} login successful`, token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;