const mongoose = require('mongoose');
const Recipe = require('./models/recipe'); // Adjust the path to your Recipe model if necessary
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

const seedRecipes = [
  {
    name: "Sushi Rolls",
    size: "4 servings",
    ingredients: ["Sushi rice", "Nori (seaweed)", "Fresh fish (e.g., salmon or tuna)"],
    prep_time: "30 minutes",
    cooking_time: "20 minutes",
    description: "Delicious sushi rolls filled with fresh fish and vegetables, perfect for any occasion.",
    main_image: "/images/sushi_rolls.jpg"
  },
  {
    name: "Ramen",
    size: "2 servings",
    ingredients: ["Ramen noodles", "Chicken broth", "Miso paste"],
    prep_time: "15 minutes",
    cooking_time: "25 minutes",
    description: "Hearty and flavorful Japanese noodle soup with a rich broth and a variety of toppings.",
    main_image: "/images/ramen.jpg"
  },
  {
    name: "Tempura",
    size: "4 servings",
    ingredients: ["Shrimp", "Vegetables", "Tempura batter mix"],
    prep_time: "20 minutes",
    cooking_time: "15 minutes",
    description: "Crispy fried vegetables and shrimp, lightly battered for a perfect crunch.",
    main_image: "/images/tempura.jpg"
  },
  {
    name: "Miso Soup",
    size: "4 servings",
    ingredients: ["Dashi stock", "Miso paste", "Tofu"],
    prep_time: "5 minutes",
    cooking_time: "10 minutes",
    description: "A simple and comforting soup made with dashi, miso paste, and soft tofu.",
    main_image: "/images/miso_soup.jpg"
  },
  {
    name: "Okonomiyaki",
    size: "2 servings",
    ingredients: ["Flour", "Cabbage", "Pork belly slices"],
    prep_time: "15 minutes",
    cooking_time: "20 minutes",
    description: "Savory Japanese pancake packed with cabbage and topped with okonomiyaki sauce and mayonnaise.",
    main_image: "/images/okonomiyaki.jpg"
  },
  {
    name: "Yakitori",
    size: "4 servings",
    ingredients: ["Chicken", "Soy sauce", "Skewers"],
    prep_time: "10 minutes",
    cooking_time: "15 minutes",
    description: "Grilled chicken skewers glazed with a savory soy sauce, perfect for an appetizer or snack.",
    main_image: "/images/yakitori.jpg"
  },
  {
    name: "Takoyaki",
    size: "6 servings",
    ingredients: ["Octopus", "Flour", "Tenkasu (tempura scraps)"],
    prep_time: "20 minutes",
    cooking_time: "10 minutes",
    description: "Popular street food made with tender octopus pieces inside a crispy batter, topped with takoyaki sauce and bonito flakes.",
    main_image: "/images/takoyaki.jpg"
  },
  {
    name: "Mochi",
    size: "8 servings",
    ingredients: ["Glutinous rice flour", "Sugar", "Cornstarch"],
    prep_time: "10 minutes",
    cooking_time: "20 minutes",
    description: "Chewy and sweet rice cakes often filled with a sweet paste, perfect for dessert.",
    main_image: "/images/mochi.jpg"
  },
];

Recipe.insertMany(seedRecipes)
  .then(() => {
    console.log('Recipes added successfully!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Failed to seed database:', err);
    mongoose.disconnect();
  });