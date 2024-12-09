const express = require("express");
const app = express();
const Joi = require("joi"); 
const Recipe = require('./models/recipe');
require('dotenv').config();
const PORT = 3001;

app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

const cors = require("cors");
app.use(cors());
app.use(express.json());

const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid name conflicts
  },
});

const upload = multer({ storage });

// Japanese recipes data
const recipes = [
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
      .optional(),
  }).unknown(true);

// GET: Fetch all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find(); // Fetch all recipes from MongoDB
    res.json(recipes); // Send the recipes as a JSON response
  } catch (err) {
    console.error('Failed to fetch recipes:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch recipes' });
  }
});

// POST request: Add a new recipe
app.post('/api/recipes', upload.single('main_image'), async (req, res) => {
  const { error } = recipeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const newRecipe = new Recipe({
    name: req.body.name,
    size: req.body.size,
    ingredients: req.body.ingredients,
    prep_time: req.body.prep_time,
    cooking_time: req.body.cooking_time,
    description: req.body.description,
    main_image: req.file ? req.file.path : null, // Save uploaded image path
  });

  try {
    const savedRecipe = await newRecipe.save();
    res.status(201).json({ success: true, recipe: savedRecipe });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add recipe' });
  }
});

// PUT request: Update existing recipe
app.put('/api/recipes/:id', upload.single('main_image'), async (req, res) => {
  const { error } = recipeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        size: req.body.size,
        ingredients: req.body.ingredients,
        prep_time: req.body.prep_time,
        cooking_time: req.body.cooking_time,
        description: req.body.description,
        main_image: req.file ? req.file.path : req.body.main_image, // Update image if a new one is uploaded
      },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.status(200).json({ success: true, recipe: updatedRecipe });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update recipe' });
  }
});

// DELETE request: Delete recipe
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.status(200).json({ success: true, message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete recipe" });
  }
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});