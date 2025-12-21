const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{11}$/, "Phone number must be exactly 11 digits"],
    },

    nationalID: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{14}$/, "National ID must be exactly 14 digits"],
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "farmer",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);