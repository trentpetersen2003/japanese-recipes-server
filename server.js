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
    main_image: Joi.string()
      .pattern(/^(https?:\/\/[^\s]+|\/[^\s]+(\.jpg|\.png|\.jpeg))$/i)
      .required(),
  }).unknown(true);

// Route to serve the recipes as JSON
app.get("/api/recipes", (req, res) => {
  res.json(recipes);
});

// POST request: Add a new recipe
app.post("/api/recipes", (req, res) => {
  console.log("Request body:", req.body); 

  const { error, value } = recipeSchema.validate(req.body);
  if (error) {
    console.error("Validation error:", error.details);
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const newRecipe = {
    _id: recipes.length + 1, 
    ...value,
  };

  recipes.push(newRecipe); 
  console.log("New recipe added:", newRecipe); 
  res.status(201).json({ success: true, recipe: newRecipe });
});

// PUT request: Update existing recipe
app.put("/api/recipes/:id", (req, res) => {
  const recipeId = parseInt(req.params.id); 

  const { error, value } = recipeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const index = recipes.findIndex((recipe) => recipe._id === recipeId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Recipe not found" });
  }

  recipes[index] = { ...recipes[index], ...value }; 
  res.status(200).json({ success: true, recipe: recipes[index] });
});

// DELETE request: Delete recipe
app.delete("/api/recipes/:id", (req, res) => {
  const recipeId = parseInt(req.params.id); 

  const index = recipes.findIndex((recipe) => recipe._id === recipeId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Recipe not found" });
  }

  recipes.splice(index, 1); 
  res.status(200).json({ success: true, message: "Recipe deleted successfully" });
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});