const express = require("express");
const session = require("express-session");
const mongodbStoreSession = require("connect-mongodb-session");
const bodyParser = require("body-parser");
const Ingredients = require("./models/ingredients");
const mongoose = require("mongoose");
const path = require("path");

const ShoppingList = require("./models/shopping-list");

const authRoutes = require("./routes/auth");

const MongoDBStoreSession = mongodbStoreSession(session);

const storeSession = new MongoDBStoreSession({
  uri: "REMOVED",
  collection: "sessions",
});

const app = express();

mongoose
  .connect("REMOVED")
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch(() => {
    console.log("Error connecting to DB.");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "REMOVED",
    resave: false,
    saveUninitialized: false,
    store: storeSession,
  })
);

app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get("/", (req, res, next) => {
  try {
    res.status(200).json({ message: "success" });
  } catch {
    res.status(500).json({ message: "Internal server error." });
  }
});

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
      .json({ message: "Internal server error when posting recipe." });
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
// requests when not logged in
app.get("/api/shopping-list", (req, res, next) => {
  const result = req.session.shoppingList;
  try {
    res.status(200).json({ result });
  } catch {
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/shopping-list", (req, res, next) => {
  const recipeId = req.body._id;
  let duplicates = false;

  if (!req.session.shoppingList || req.session.shoppingList.length === 0) {
    req.session.shoppingList = [];
  }

  for (let i = 0; i < req.session.shoppingList.length; i++) {
    if (recipeId === req.session.shoppingList[i]._id) {
      duplicates = true;
    }
  }

  if (!duplicates) {
    req.session.shoppingList.push(req.body);
    req.session.save(function () {
      try {
        res
          .status(201)
          .json({ message: "Added items to shopping list (session)" });
      } catch {
        res.status(500).json({
          message:
            "Internal server error when trying to add recipe to shopping list (session).",
        });
      }
    });
    return;
  }

  try {
    res.status(200).json({
      message: "No items added to shopping list (session), duplicate found.",
      duplicates,
    });
  } catch {
    res.status(500).json({
      message:
        "Internal server error when trying to add recipe to shopping list (session) with duplicates.",
    });
  }
});

app.post("/api/shopping-list/:recipeId/delete/", (req, res, next) => {
  for (let i = 0; i < req.session.shoppingList.length; i++) {
    if (req.session.shoppingList[i]._id === req.params.recipeId) {
      req.session.shoppingList.splice(i, 1);
    }
  }
  req.session.save(() => {
    try {
      res
        .status(200)
        .json({ message: "Removed item from shopping list (session)." });
    } catch {
      res.status(500).json({ message: "Internal server error." });
    }
  });
});

// Shopping list requests when logged in: get shopping list based on userId from db
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
  const recipeId = req.body._id;
  let duplicates = false;

  const shoppingListItem = new ShoppingList({
    userId: req.params.id,
    items: req.body,
  });

  ShoppingList.findOne({ userId: req.params.id }).then((result) => {
    if (result) {
      const shoppingList = result.items;

      for (let i = 0; i < shoppingList.length; i++) {
        if (recipeId === shoppingList[i]._id.toString()) {
          duplicates = true;
        }
      }

      if (!duplicates) {
        ShoppingList.updateOne(
          { _id: result._id },
          { $push: { items: req.body } }
        ).then(() => {
          try {
            res
              .status(201)
              .json({ message: "Shopping list (logged in) updated." });
          } catch {
            res.status(500).json({
              message:
                "Internal server error updating shopping list (logged in).",
            });
          }
        });
        return;
      }

      try {
        res.status(200).json({
          message: "Shopping list (logged in) not updated, duplicates found.",
          duplicates,
        });
      } catch {
        res.status(500).json({
          message:
            "Internal server error updating shopping list (logged in) with duplicates.",
        });
      }
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
  ).then(() => {
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
