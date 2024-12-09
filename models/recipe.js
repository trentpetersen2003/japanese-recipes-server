const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  ingredients: { type: [String], required: true },
  prep_time: { type: String, required: true },
  cooking_time: { type: String, required: true },
  description: { type: String, required: true },
  main_image: { type: String, required: true },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;