const express = require("express");
const app = express();
const Joi = require("joi"); 
const PORT = 3001;

app.use(express.static("public"));

const cors = require("cors");
app.use(cors());
app.use(express.json());

// Japanese recipes data
const recipes = [
    {
      _id: 1,
      name: "Sushi Rolls",
      size: "4 servings",
      ingredients: ["Sushi rice", "Nori (seaweed)", "Fresh fish (e.g., salmon or tuna)"],
      prep_time: "30 minutes",
      cooking_time: "20 minutes",
      description: "Delicious sushi rolls filled with fresh fish and vegetables, perfect for any occasion.",
      main_image: "/images/sushi_rolls.jpg",
    },
    {
      _id: 2,
      name: "Ramen",
      size: "2 servings",
      ingredients: ["Ramen noodles", "Chicken broth", "Miso paste"],
      prep_time: "15 minutes",
      cooking_time: "25 minutes",
      description: "Hearty and flavorful Japanese noodle soup with a rich broth and a variety of toppings.",
      main_image: "/images/ramen.jpg",
    },
    {
      _id: 3,
      name: "Tempura",
      size: "4 servings",
      ingredients: ["Shrimp", "Vegetables", "Tempura batter mix"],
      prep_time: "20 minutes",
      cooking_time: "15 minutes",
      description: "Crispy fried vegetables and shrimp, lightly battered for a perfect crunch.",
      main_image: "/images/tempura.jpg",
    },
    {
      _id: 4,
      name: "Miso Soup",
      size: "4 servings",
      ingredients: ["Dashi stock", "Miso paste", "Tofu"],
      prep_time: "5 minutes",
      cooking_time: "10 minutes",
      description: "A simple and comforting soup made with dashi, miso paste, and soft tofu.",
      main_image: "/images/miso_soup.jpg",
    },
    {
      _id: 5,
      name: "Okonomiyaki",
      size: "2 servings",
      ingredients: ["Flour", "Cabbage", "Pork belly slices"],
      prep_time: "15 minutes",
      cooking_time: "20 minutes",
      description: "Savory Japanese pancake packed with cabbage and topped with okonomiyaki sauce and mayonnaise.",
      main_image: "/images/okonomiyaki.jpg",
    },
    {
      _id: 6,
      name: "Yakitori",
      size: "4 servings",
      ingredients: ["Chicken", "Soy sauce", "Skewers"],
      prep_time: "10 minutes",
      cooking_time: "15 minutes",
      description: "Grilled chicken skewers glazed with a savory soy sauce, perfect for an appetizer or snack.",
      main_image: "/images/yakitori.jpg",
    },
    {
      _id: 7,
      name: "Takoyaki",
      size: "6 servings",
      ingredients: ["Octopus", "Flour", "Tenkasu (tempura scraps)"],
      prep_time: "20 minutes",
      cooking_time: "10 minutes",
      description: "Popular street food made with tender octopus pieces inside a crispy batter, topped with takoyaki sauce and bonito flakes.",
      main_image: "/images/takoyaki.jpg",
    },
    {
      _id: 8,
      name: "Mochi",
      size: "8 servings",
      ingredients: ["Glutinous rice flour", "Sugar", "Cornstarch"],
      prep_time: "10 minutes",
      cooking_time: "20 minutes",
      description: "Chewy and sweet rice cakes often filled with a sweet paste, perfect for dessert.",
      main_image: "/images/mochi.jpg",
    },
  ];

  const recipeSchema = Joi.object({
    name: Joi.string().min(3).required(),
    size: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()).min(1).required(),
    prep_time: Joi.string().required(),
    cooking_time: Joi.string().required(),
    description: Joi.string().required(),
    main_image: Joi.string().uri().required(),
  });

// Route to serve the recipes as JSON
app.get("/api/recipes", (req, res) => {
  res.json(recipes);
});

// POST request: Add a new recipe
app.post("/api/recipes", (req, res) => {
  console.log("Request body:", req.body); // Log incoming data for debugging

  const { error, value } = recipeSchema.validate(req.body);
  if (error) {
    console.error("Validation error:", error.details); // Log validation errors
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const newRecipe = {
    _id: recipes.length + 1, // Generate new ID
    ...value,
  };

  recipes.push(newRecipe); // Add the new recipe
  console.log("New recipe added:", newRecipe); // Log the added recipe
  res.status(201).json({ success: true, recipe: newRecipe });
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});