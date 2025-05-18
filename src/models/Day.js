const mongoose = require("mongoose");

const DaySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
});

module.exports = mongoose.models.Day || mongoose.model("Day", DaySchema);