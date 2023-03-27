const express = require("express");
const bodyParser = require("body-parser");
const Ingredients = require("./models/ingredients");
const mongoose = require("mongoose");
const path = require("path");

const ShoppingList = require("./models/shopping-list");

const authRoutes = require("./routes/auth");

const app = express();

mongoose
  .connect(
    "mongodb+srv://alemaite:TOKENREMOVED@cluster0.7l41bhv.mongodb.net/recipes?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch(() => {
    console.log("Error connecting to DB.");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular")));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });

// app.get("/", (req, res, next) => {
//   try {
//     res.status(200).json({ message: "success" });
//   } catch {
//     res.status(500).json({ message: "Internal server error." });
//   }
// });

// REST API

// Auth
app.use("/api/users", authRoutes);

// Recipes

app.post("/api/recipes", (req, res, next) => {
  const recipe = new Ingredients(req.body);
  try {
    recipe.save().then((recipe) => {
      res.status(201).json({ message: "Recipe posted.", recipe });
    });
  } catch {
    res
      .status(500)
      .json({ message: "Internal server error when posting recipe" });
  }
});

app.post("/api/:id/delete", (req, res, next) => {
  try {
    Ingredients.deleteOne({ _id: req.params.id }).then(() => {
      res.status(200).json({ message: "Recipe deleted successfully." });
    });
  } catch {
    res
      .status(500)
      .json({ message: "Internal server error when deleting recipes" });
  }
});

app.get("/api/recipes", (req, res, next) => {
  try {
    Ingredients.find().then((recipes) => {
      res.status(200).json(recipes);
    });
  } catch {
    res
      .status(500)
      .json({ message: "Internal server error when getting recipes" });
  }
});

app.get("/api/:id/recipe", (req, res, next) => {
  try {
    Ingredients.findOne({ _id: req.params.id }).then((recipe) => {
      res.status(200).json(recipe);
    });
  } catch {
    res
      .status(500)
      .json({ message: "Internal server error when getting recipe." });
  }
});

// Shopping List

// get shopping list based on userId from db
app.get("/api/:id/shopping-list", (req, res, next) => {
  ShoppingList.findOne({ userId: req.params.id }).then((result) => {
    if (result) {
      try {
        res.status(200).json(result);
      } catch {
        res
          .status(500)
          .json({ message: "Internal server error updating shopping list." });
      }
    }
  });
});

// add recipe ingredients to shopping list
app.post("/api/:id/shopping-list", (req, res, next) => {
  const shoppingListItem = new ShoppingList({
    userId: req.params.id,
    items: req.body,
  });
  ShoppingList.findOne({ userId: req.params.id }).then((result) => {
    if (result) {
      ShoppingList.updateOne(
        { _id: result._id },
        { $push: { items: req.body } }
      ).then(() => {
        try {
          res.status(201).json({ message: "Shopping list updated." });
        } catch {
          res
            .status(500)
            .json({ message: "Internal server error updating shopping list." });
        }
      });
      return;
    }
    try {
      shoppingListItem.save().then(() => {
        res.status(201).json({ message: "New Shopping list added." });
      });
    } catch {
      res.status(500).json({
        message: "Internal server error adding new shopping list.",
      });
    }
  });
});

// delete recipe ingredients from shopping list
app.post("/api/:id/shopping-list/:recipeId/delete", (req, res, next) => {
  const userId = req.params.id;
  const recipeId = req.params.recipeId;

  ShoppingList.updateOne(
    { userId: userId },
    { $pull: { items: { _id: recipeId } } }
  ).then((result) => {
    try {
      res
        .status(200)
        .json({ message: "Recipe ingredients removed successfully." });
    } catch {
      res.status(500).json({
        message: "Internal server error adding new shopping list.",
      });
    }
  });
});

// serve index.html (integrated approach serving front & backend on same server)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
