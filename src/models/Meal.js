const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: Number, default: 0 },
  description: { type: String }
});

module.exports = mongoose.models.Meal || mongoose.model("Meal", MealSchema);