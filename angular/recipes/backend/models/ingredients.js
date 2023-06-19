const mongoose = require("mongoose");
const Ingredient = require("./ingredient");

const ingredientsSchema = mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [Ingredient.schema], required: true },
  desc: { type: [String] },
});

module.exports = mongoose.model("Ingredients", ingredientsSchema);
