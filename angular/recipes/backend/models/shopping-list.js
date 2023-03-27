const mongoose = require("mongoose");
const Ingredients = require("./ingredients");

const shoppingListSchema = mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: [Ingredients.schema], required: true },
});

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
