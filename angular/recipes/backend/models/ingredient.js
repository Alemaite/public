const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
  quantity: { type: Number, required: true },
  unit: { type: String },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
